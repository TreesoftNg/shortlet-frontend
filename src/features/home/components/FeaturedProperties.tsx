'use client';

import { AppButton, PropertyCard, SectionHeader } from '@/shared/components';
import type { Property } from '@/data/types';
import { Box, Grid } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';

type FeaturedPropertiesProps = {
  properties: Property[];
};

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <Box>
      <SectionHeader
        title="Featured apartments"
        subtitle="Handpicked stays our guests love"
        action={
          <AppButton href="/search" variant="outline" size="sm">
            View all <ArrowRight size={16} strokeWidth={1.9} />
          </AppButton>
        }
      />

      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        gap={{ base: 5, md: 6, lg: '26px' }}
      >
        {properties.slice(0, 4).map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            initiallySaved={index === 1}
          />
        ))}
      </Grid>
    </Box>
  );
}
