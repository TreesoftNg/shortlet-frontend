'use client';

/** Re-export shared data hooks so home stays import-stable. */
export {
  useFeaturedProperties,
  useNeighborhoods,
  useWebsiteContent,
} from '@/data/hooks';
