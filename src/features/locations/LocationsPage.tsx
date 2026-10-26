'use client';

// Neighbourhoods / locations UI temporarily disabled
// import { useNeighborhoods } from '@/data/hooks';
import {
  AppButton,
  AppPage,
  EmptyState,
  // ErrorState,
  // NeighborhoodTile,
  // NeighborhoodTileSkeleton,
  PageHero,
} from '@/shared/components';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MapPin } from 'lucide-react';

export function LocationsPage() {
  // const {
  //   data: neighborhoods = [],
  //   isPending,
  //   isError,
  //   refetch,
  // } = useNeighborhoods();

  return (
    <AppPage mainPt={{ base: 8, md: 12 }}>
      <PageHero
        eyebrow="Destinations"
        title="Locations"
        description="Neighbourhood browsing is coming soon."
      />

      {/* Neighbourhood tiles temporarily disabled
      {isPending ? (
        <LocationsSkeleton />
      ) : isError ? (
        <ErrorState ... />
      ) : (
        <Grid>...</Grid>
      )}
      */}

      <EmptyState
        title="Neighbourhoods coming soon"
        description="Browse all verified stays for now — area guides will be back shortly."
        actionLabel="Open search"
        actionHref="/search"
        icon={<MapPin size={22} strokeWidth={1.9} />}
      />

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

// function LocationsSkeleton() {
//   return (
//     <Grid ...>
//       {Array.from({ length: 3 }).map((_, i) => (
//         <NeighborhoodTileSkeleton key={i} ... />
//       ))}
//     </Grid>
//   );
// }
