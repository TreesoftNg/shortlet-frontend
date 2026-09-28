'use client';

import { NeighborhoodTile, SectionHeader } from '@/shared/components';
import type { Neighborhood } from '@/data/types';
import { Box, Grid } from '@chakra-ui/react';

type NeighborhoodGridProps = {
  neighborhoods: Neighborhood[];
};

export function NeighborhoodGrid({ neighborhoods }: NeighborhoodGridProps) {
  return (
    <Box>
      <SectionHeader
        title="Explore by neighbourhood"
        subtitle="Find the right base for work, rest or a weekend away"
      />

      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={{ base: 3, md: 4, lg: '20px' }}
      >
        {neighborhoods.map((area) => (
          <NeighborhoodTile
            key={area.id}
            neighborhood={area}
            height={{ base: '180px', md: '220px' }}
          />
        ))}
      </Grid>
    </Box>
  );
}
