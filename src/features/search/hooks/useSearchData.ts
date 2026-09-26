'use client';

import {
  getNeighborhoodBySlug,
  getProperties,
  type PropertyListParams,
  type PropertySort,
} from '@/data/api';
import { neighborhoods, properties } from '@/data/mocks';
import { useQuery } from '@tanstack/react-query';
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
  guests: 2,
  nights: 4,
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
  const params = toParams(filters);

  return useQuery({
    queryKey: ['properties', 'search', params],
    queryFn: () => getProperties(params),
    initialData: () => {
      // Sync first paint; React Query will still refetch.
      return properties.filter((p) => p.listed);
    },
    initialDataUpdatedAt: 0,
  });
}

export function useSearchNeighborhood(slug?: string) {
  return useQuery({
    queryKey: ['neighborhood', slug],
    queryFn: () => (slug ? getNeighborhoodBySlug(slug) : Promise.resolve(null)),
    initialData: () =>
      slug
        ? neighborhoods.find((n) => n.slug === slug) ?? null
        : null,
    enabled: true,
  });
}

export function useActiveFilterCount(filters: SearchFilters) {
  return useMemo(() => {
    let count = 0;
    if (filters.minBedrooms) count += 1;
    count += filters.amenities.length;
    return count;
  }, [filters]);
}
