'use client';

import { useNeighborhood, usePublicUnits } from '@/data/hooks';
import { toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import type { PropertySort } from '@/data/api';
import type { Property, PublicUnitsTab } from '@/data/types';
import { DEMO_STAY } from '@/data/demo-stay';
import { nightsBetween } from '@/shared/lib/format';
import { useMemo } from 'react';

export type SearchFilters = {
  /** Public units API tab (all | studios | one_bedroom | …). */
  tab: PublicUnitsTab;
  neighborhood?: string;
  guests: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  sort: PropertySort;
};

export const defaultSearchFilters: SearchFilters = {
  tab: 'all',
  guests: DEMO_STAY.guests,
  nights: DEMO_STAY.nights,
  checkIn: DEMO_STAY.checkIn,
  checkOut: DEMO_STAY.checkOut,
  sort: 'recommended',
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

export function useSearchProperties(filters: SearchFilters) {
  const tab = toPublicUnitsTab(filters.tab);
  const query = usePublicUnits({ tab, limit: 100 });

  const data = useMemo(() => {
    let list = query.data ?? [];
    if (filters.guests > 0) {
      list = list.filter((p) => (p.capacity.max ?? 0) >= filters.guests);
    }
    if (filters.neighborhood) {
      const q = filters.neighborhood.toLowerCase();
      list = list.filter(
        (p) =>
          p.address.city.toLowerCase().includes(q) ||
          p.address.display.toLowerCase().includes(q) ||
          (p.address.street?.toLowerCase().includes(q) ?? false),
      );
    }
    return sortProperties(list, filters.sort);
  }, [query.data, filters.guests, filters.neighborhood, filters.sort]);

  return { ...query, data };
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
