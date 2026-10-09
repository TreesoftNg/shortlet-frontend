'use client';

import { useNeighborhood, usePublicUnits } from '@/data/hooks';
import { toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import type {
  Property,
  PropertySort,
  PublicUnitsListMeta,
  PublicUnitsTab,
} from '@/data/types';
import { getDefaultStay } from '@/shared/lib/default-stay';
import { nightsBetween } from '@/shared/lib/format';
import { useMemo } from 'react';

export const SEARCH_PAGE_SIZE = 6;

/** Fetch enough units when we need client-side neighbourhood/guest filtering. */
const SEARCH_FETCH_LIMIT = 100;

export type SearchFilters = {
  /** Public units API tab (all | studios | one_bedroom | …). */
  tab: PublicUnitsTab;
  neighborhood?: string;
  guests: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  sort: PropertySort;
  page: number;
};

const stayDefaults = getDefaultStay();

export const defaultSearchFilters: SearchFilters = {
  tab: 'all',
  guests: stayDefaults.guests,
  nights: stayDefaults.nights,
  checkIn: stayDefaults.checkIn,
  checkOut: stayDefaults.checkOut,
  sort: 'recommended',
  page: 1,
};

function sortProperties(list: Property[], sort: PropertySort) {
  switch (sort) {
    case 'price_asc':
      return [...list].sort(
        (a, b) => a.pricing.nightly_rate - b.pricing.nightly_rate,
      );
    case 'price_desc':
      return [...list].sort(
        (a, b) => b.pricing.nightly_rate - a.pricing.nightly_rate,
      );
    case 'rating':
      return [...list].sort(
        (a, b) => b.review_summary.rating - a.review_summary.rating,
      );
    default:
      return list;
  }
}

function matchesNeighborhood(property: Property, slug: string): boolean {
  const q = slug.trim().toLowerCase();
  if (!q) return true;

  const city = property.address.city.toLowerCase();
  const display = property.address.display.toLowerCase();
  const street = (property.address.street ?? '').toLowerCase();
  const neighborhoodId = property.neighborhood_id.toLowerCase();
  const citySlug = city.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    neighborhoodId === q ||
    citySlug === q ||
    city === q ||
    display.includes(q) ||
    street.includes(q)
  );
}

export function useSearchProperties(filters: SearchFilters) {
  const tab = toPublicUnitsTab(filters.tab);
  const page = Math.max(1, filters.page || 1);
  const needsClientFilter = Boolean(filters.neighborhood);

  const query = usePublicUnits({
    tab,
    page: needsClientFilter ? 1 : page,
    limit: needsClientFilter ? SEARCH_FETCH_LIMIT : SEARCH_PAGE_SIZE,
  });

  const filtered = useMemo(() => {
    let list = query.data?.items ?? [];
    if (filters.guests > 0) {
      list = list.filter((p) => (p.capacity.max ?? 0) >= filters.guests);
    }
    if (filters.neighborhood) {
      list = list.filter((p) => matchesNeighborhood(p, filters.neighborhood!));
    }
    return sortProperties(list, filters.sort);
  }, [query.data, filters.guests, filters.neighborhood, filters.sort]);

  const data = useMemo(() => {
    if (!needsClientFilter) return filtered;
    const start = (page - 1) * SEARCH_PAGE_SIZE;
    return filtered.slice(start, start + SEARCH_PAGE_SIZE);
  }, [filtered, needsClientFilter, page]);

  const meta: PublicUnitsListMeta = useMemo(() => {
    if (!needsClientFilter) {
      const apiMeta = query.data?.meta;
      if (!apiMeta) {
        return {
          page,
          limit: SEARCH_PAGE_SIZE,
          total: data.length,
          totalPages: 1,
        };
      }
      // Guest filter is client-side on the current page only.
      if (filters.guests > 1) {
        return {
          ...apiMeta,
          total: filtered.length,
          totalPages: apiMeta.totalPages,
        };
      }
      return apiMeta;
    }

    const total = filtered.length;
    return {
      page,
      limit: SEARCH_PAGE_SIZE,
      total,
      totalPages: Math.max(1, Math.ceil(total / SEARCH_PAGE_SIZE)),
    };
  }, [
    needsClientFilter,
    query.data?.meta,
    page,
    data.length,
    filtered.length,
    filters.guests,
  ]);

  return { ...query, data, meta };
}

export function useSearchNeighborhood(slug?: string) {
  return useNeighborhood(slug);
}

export function syncSearchNights(filters: SearchFilters): SearchFilters {
  return {
    ...filters,
    nights: nightsBetween(filters.checkIn, filters.checkOut),
  };
}

export { toPublicUnitsTab };
