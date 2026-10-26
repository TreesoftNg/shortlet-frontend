'use client';

import { Box } from '@chakra-ui/react';

type SkeletonProps = {
  h?: string | number | Record<string, string | number>;
  w?: string | number | Record<string, string | number>;
  borderRadius?: string | Record<string, string>;
  mt?: string | number | Record<string, string | number>;
  mb?: string | number | Record<string, string | number>;
};

/** Pulsing placeholder block for loading states. */
export function Skeleton({
  h = '16px',
  w = '100%',
  borderRadius = 'md',
  mt,
  mb,
}: SkeletonProps) {
  return (
    <Box
      h={h}
      w={w}
      mt={mt}
      mb={mb}
      borderRadius={borderRadius}
      bg="line.2"
      className="skeleton-pulse"
      aria-hidden
    />
  );
}

type SkeletonTextProps = {
  lines?: number;
  gap?: string | number;
  lastWidth?: string;
};

export function SkeletonText({
  lines = 3,
  gap = '10px',
  lastWidth = '60%',
}: SkeletonTextProps) {
  return (
    <Box display="flex" flexDirection="column" gap={gap}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          h="14px"
          w={i === lines - 1 ? lastWidth : '100%'}
          borderRadius="full"
        />
      ))}
    </Box>
  );
}

export function PropertyCardSkeleton() {
  return (
    <Box>
      <Box
        borderRadius="lg"
        overflow="hidden"
        mb="12px"
        aspectRatio="1 / 1"
        className="skeleton-pulse"
        bg="line.2"
      />
      <SkeletonText lines={2} lastWidth="40%" />
      <Skeleton h="14px" w="55%" mt="10px" borderRadius="full" />
    </Box>
  );
}

type PropertyCardSkeletonGridProps = {
  count?: number;
  columns?: Record<string, string>;
};

export function PropertyCardSkeletonGrid({
  count = 6,
  columns = {
    base: '1fr',
    sm: 'repeat(2, 1fr)',
    xl: 'repeat(3, 1fr)',
  },
}: PropertyCardSkeletonGridProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns={columns}
      gap={{ base: 5, md: '26px 22px' }}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </Box>
  );
}

export function NeighborhoodTileSkeleton({
  height = '220px',
}: {
  height?: string | Record<string, string>;
}) {
  return <Skeleton h={height} borderRadius="lg" />;
}
