import { ApiError, http, httpWithMeta, type ApiListMeta } from '@/data/api/http';
import {
  mapPublicUnitDetailToProperty,
  mapPublicUnitToProperty,
  type PublicUnitDetailMapped,
} from '@/data/lib/map-public-unit';
import { toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import type { Property } from '@/data/types';
import type {
  PublicUnitCard,
  PublicUnitDetail,
  PublicUnitsListMeta,
  PublicUnitsTab,
} from '@/data/types/public-unit';

export type PublicUnitsParams = {
  tab?: PublicUnitsTab | string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type { PublicUnitDetailMapped };

export type PublicUnitsPage = {
  items: Property[];
  meta: PublicUnitsListMeta;
};

function toListMeta(
  meta: ApiListMeta,
  fallback: { page: number; limit: number; count: number },
): PublicUnitsListMeta {
  const page = Number(meta.page);
  const limit = Number(meta.limit);
  const total = Number(meta.total);
  const totalPages = Number(meta.totalPages);
  return {
    requestId:
      typeof meta.requestId === 'string' ? meta.requestId : undefined,
    page: Number.isFinite(page) && page > 0 ? page : fallback.page,
    limit: Number.isFinite(limit) && limit > 0 ? limit : fallback.limit,
    total: Number.isFinite(total) ? total : fallback.count,
    totalPages:
      Number.isFinite(totalPages) && totalPages > 0
        ? totalPages
        : Math.max(1, Math.ceil(fallback.count / Math.max(fallback.limit, 1))),
  };
}

function buildQuery(params: PublicUnitsParams): string {
  const qs = new URLSearchParams();
  qs.set('tab', toPublicUnitsTab(params.tab));
  if (params.page != null) qs.set('page', String(params.page));
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.minPrice != null) qs.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) qs.set('maxPrice', String(params.maxPrice));
  return qs.toString();
}

/** GET /api/v1/public/units — browse stays by home-page tab / price filters. */
export async function getPublicUnits(
  params: PublicUnitsParams = {},
): Promise<PublicUnitsPage> {
  const query = buildQuery(params);
  const { data, meta } = await httpWithMeta<PublicUnitCard[]>(
    `/api/v1/public/units?${query}`,
  );
  const items = (Array.isArray(data) ? data : []).map(mapPublicUnitToProperty);
  return {
    items,
    meta: toListMeta(meta, {
      page: params.page ?? 1,
      limit: params.limit ?? items.length,
      count: items.length,
    }),
  };
}

/** GET /api/v1/public/units/:id — single stay detail (amenities + reviews included). */
export async function getPublicUnitById(
  id: string,
): Promise<PublicUnitDetailMapped | null> {
  if (!id) return null;
  try {
    const detail = await http<PublicUnitDetail>(
      `/api/v1/public/units/${encodeURIComponent(id)}`,
    );
    return mapPublicUnitDetailToProperty(detail);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 404 || error.code === 'RESOURCE_NOT_FOUND')
    ) {
      return null;
    }
    throw error;
  }
}
