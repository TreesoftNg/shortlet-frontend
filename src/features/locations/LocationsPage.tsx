'use client';

import { useNeighborhoods } from '@/data/hooks';
import {
  AppButton,
  AppPage,
  EmptyState,
  ErrorState,
  NeighborhoodTile,
  NeighborhoodTileSkeleton,
  PageHero,
} from '@/shared/components';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { MapPin } from 'lucide-react';

export function LocationsPage() {
  const {
    data: neighborhoods = [],
    isPending,
    isError,
    refetch,
  } = useNeighborhoods();

  return (
    <AppPage mainPt={{ base: 8, md: 12 }}>
      <PageHero
        eyebrow="Destinations"
        title="Locations"
        description="Browse Sunmade neighbourhoods from the live catalogue, then jump into available apartments in each area."
      />

      {isPending ? (
        <LocationsSkeleton />
      ) : isError ? (
        <ErrorState
          title="Couldn’t load locations"
          description="Neighbourhoods are temporarily unavailable."
          onRetry={() => {
            void refetch();
          }}
          mt={6}
        />
      ) : neighborhoods.length === 0 ? (
        <EmptyState
          title="No locations yet"
          description="We’re adding Sunmade neighbourhoods soon."
          actionLabel="Open search"
          actionHref="/search"
          icon={<MapPin size={22} strokeWidth={1.9} />}
        />
      ) : (
        <Grid
          templateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={{ base: 3, md: 4 }}
        >
          {neighborhoods.map((area) => (
            <NeighborhoodTile
              key={area.id}
              neighborhood={area}
              height={{ base: '200px', md: '240px' }}
            />
          ))}
        </Grid>
      )}

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

function LocationsSkeleton() {
  return (
    <Grid
      aria-busy="true"
      templateColumns={{
        base: '1fr',
        sm: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
      }}
      gap={{ base: 3, md: 4 }}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <NeighborhoodTileSkeleton
          key={i}
          height={{ base: '200px', md: '240px' }}
        />
      ))}
    </Grid>
  );
}
