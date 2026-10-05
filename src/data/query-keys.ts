/**
 * Central React Query keys.
 *
 * Rules for other developers:
 * 1. Server/cacheable data → React Query + these keys (never Zustand).
 * 2. Ephemeral UI (map hover, selected unit) → local state or a tiny UI store.
 * 3. Session that must survive refresh → auth Zustand (persisted) only.
 *
 * Keep keys hierarchical so invalidation stays predictable:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all })
 */

import type { PropertyListParams } from '@/data/api/properties';
import type { PublicUnitsParams } from '@/data/api/public-units';
import type { TripTab } from '@/data/types';

export const queryKeys = {
  content: {
    all: ['content'] as const,
    website: () => [...queryKeys.content.all, 'website'] as const,
  },

  neighborhoods: {
    all: ['neighborhoods'] as const,
    list: () => [...queryKeys.neighborhoods.all, 'list'] as const,
    detail: (slug: string) =>
      [...queryKeys.neighborhoods.all, 'detail', slug] as const,
  },

  publicUnits: {
    all: ['public-units'] as const,
    lists: () => [...queryKeys.publicUnits.all, 'list'] as const,
    list: (params: PublicUnitsParams = {}) =>
      [...queryKeys.publicUnits.lists(), params] as const,
  },

  properties: {
    all: ['properties'] as const,
    lists: () => [...queryKeys.properties.all, 'list'] as const,
    list: (params: PropertyListParams) =>
      [...queryKeys.properties.lists(), params] as const,
    featured: (tab = 'all') =>
      [...queryKeys.properties.all, 'featured', tab] as const,
    detail: (slug: string) =>
      [...queryKeys.properties.all, 'detail', slug] as const,
  },

  reviews: {
    all: ['reviews'] as const,
    byProperty: (propertyId: string) =>
      [...queryKeys.reviews.all, 'property', propertyId] as const,
  },

  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (tab: TripTab | 'all' = 'all') =>
      [...queryKeys.bookings.lists(), tab] as const,
    counts: () => [...queryKeys.bookings.all, 'counts'] as const,
    detail: (id: string) =>
      [...queryKeys.bookings.all, 'detail', id] as const,
  },
} as const;
