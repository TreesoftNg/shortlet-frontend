'use client';

import {
  getPropertyBySlug,
  getReviewsByPropertyId,
} from '@/data/api';
import { properties, reviews } from '@/data/mocks';
import { useQuery } from '@tanstack/react-query';

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => getPropertyBySlug(slug),
    initialData: () => properties.find((p) => p.slug === slug) ?? null,
    initialDataUpdatedAt: 0,
  });
}

export function usePropertyReviews(propertyId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () =>
      propertyId
        ? getReviewsByPropertyId(propertyId)
        : Promise.resolve([]),
    initialData: () =>
      propertyId
        ? reviews.filter((r) => r.property_id === propertyId)
        : [],
    enabled: Boolean(propertyId),
  });
}
