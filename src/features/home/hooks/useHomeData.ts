'use client';

import {
  getNeighborhoods,
  getProperties,
  getWebsiteContent,
} from '@/data/api';
import {
  neighborhoods,
  properties,
  websiteContent,
} from '@/data/mocks';
import { useQuery } from '@tanstack/react-query';

export const queryKeys = {
  content: ['website-content'] as const,
  neighborhoods: ['neighborhoods'] as const,
  featuredProperties: ['properties', 'featured'] as const,
};

export function useWebsiteContent() {
  return useQuery({
    queryKey: queryKeys.content,
    queryFn: getWebsiteContent,
    // Seed so SSR + first client paint match (no spinner flash).
    initialData: websiteContent,
  });
}

export function useNeighborhoods() {
  return useQuery({
    queryKey: queryKeys.neighborhoods,
    queryFn: getNeighborhoods,
    initialData: neighborhoods,
  });
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: queryKeys.featuredProperties,
    queryFn: () => getProperties({ featured: true }),
    initialData: properties.filter((p) => p.listed && p.featured),
  });
}
