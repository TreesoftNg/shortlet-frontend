'use client';

import { useNeighborhood, useProperties } from '@/data/hooks';
import type { PropertyListParams, PropertySort } from '@/data/api';
import { DEMO_STAY } from '@/data/demo-stay';
import { useMemo } from 'react';

export type SearchFilters = {
  neighborhood?: string;
  guests: number;
  nights: number;
  minBedrooms: number | null;
  amenities: string[];
  sort: PropertySort;
};

export const defaultSearchFilters: SearchFilters = {
  guests: DEMO_STAY.guests,
  nights: DEMO_STAY.nights,
  minBedrooms: null,
  amenities: [],
  sort: 'recommended',
};

function toParams(filters: SearchFilters): PropertyListParams {
  return {
    neighborhood: filters.neighborhood,
    guests: filters.guests,
    minBedrooms: filters.minBedrooms ?? undefined,
    amenities: filters.amenities.length ? filters.amenities : undefined,
    sort: filters.sort,
  };
}

export function useSearchProperties(filters: SearchFilters) {
  return useProperties(toParams(filters));
}

export function useSearchNeighborhood(slug?: string) {
  return useNeighborhood(slug);
}

export function useActiveFilterCount(filters: SearchFilters) {
  return useMemo(() => {
    let count = 0;
    if (filters.minBedrooms) count += 1;
    count += filters.amenities.length;
    return count;
  }, [filters]);
}
