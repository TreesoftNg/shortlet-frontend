'use client';

import { useNeighborhoods } from '@/features/home/hooks/useHomeData';
import {
  AppButton,
  AppPage,
  NeighborhoodTile,
  PageHero,
} from '@/shared/components';
import type { Neighborhood } from '@/data/types';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';

export function LocationsPage() {
  const { data: neighborhoods = [] } = useNeighborhoods();

  const lagos = neighborhoods.filter((n) => n.city === 'Lagos');
  const abuja = neighborhoods.filter((n) => n.city === 'Abuja');

  return (
    <AppPage mainPt={{ base: 8, md: 12 }}>
      <PageHero
        eyebrow="Destinations"
        title="Locations"
        description="Browse Sunmade neighbourhoods across Lagos and Abuja, then jump into available apartments in each area."
      />

      <CitySection title="Lagos" areas={lagos} />
      <CitySection title="Abuja" areas={abuja} mt={{ base: 10, md: 12 }} />

      <Flex
        mt={{ base: 10, md: 12 }}
        direction={{ base: 'column', sm: 'row' }}
        align={{ sm: 'center' }}
        justify="space-between"
        gap={4}
        bg="bg.soft"
        borderRadius="20px"
        p={{ base: 6, md: 8 }}
      >
        <Box>
          <Text fontWeight="800" fontSize="20px" letterSpacing="-0.01em">
            Looking for something specific?
          </Text>
          <Text color="ink.2" fontSize="14px" mt="4px">
            Use search filters for dates, guests, and amenities.
          </Text>
        </Box>
        <AppButton href="/search">Open search</AppButton>
      </Flex>
    </AppPage>
  );
}

function CitySection({
  title,
  areas,
  mt,
}: {
  title: string;
  areas: Neighborhood[];
  mt?: { base: number; md: number };
}) {
  if (!areas.length) return null;

  return (
    <Box mt={mt}>
      <Heading
        as="h2"
        fontSize={{ base: '22px', md: '26px' }}
        fontWeight="700"
        letterSpacing="-0.01em"
        mb="18px"
      >
        {title}
      </Heading>
      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={{ base: 3, md: 4 }}
      >
        {areas.map((area) => (
          <NeighborhoodTile
            key={area.id}
            neighborhood={area}
            height={{ base: '200px', md: '240px' }}
          />
        ))}
      </Grid>
    </Box>
  );
}
