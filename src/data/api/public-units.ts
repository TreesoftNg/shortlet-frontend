import { ApiError, http } from '@/data/api/http';
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
): Promise<Property[]> {
  const query = buildQuery(params);
  const items = await http<PublicUnitCard[]>(
    `/api/v1/public/units?${query}`,
  );
  return (Array.isArray(items) ? items : []).map(mapPublicUnitToProperty);
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
