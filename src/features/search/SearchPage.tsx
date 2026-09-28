'use client';

import { SearchFiltersBar } from '@/features/search/components/SearchFiltersBar';
import { SearchMap } from '@/features/search/components/SearchMap';
import { SearchMiniBar } from '@/features/search/components/SearchMiniBar';
import { SearchResults } from '@/features/search/components/SearchResults';
import {
  defaultSearchFilters,
  useActiveFilterCount,
  useSearchNeighborhood,
  useSearchProperties,
  type SearchFilters,
} from '@/features/search/hooks/useSearchData';
import { DEMO_STAY } from '@/data/demo-stay';
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { Box, Grid } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function SearchPage() {
  const searchParams = useSearchParams();
  const neighborhoodParam = searchParams.get('neighborhood') ?? undefined;

  const [filters, setFilters] = useState<SearchFilters>({
    ...defaultSearchFilters,
    neighborhood: neighborhoodParam,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      neighborhood: neighborhoodParam,
    }));
  }, [neighborhoodParam]);

  const { data: properties = [] } = useSearchProperties(filters);
  const { data: neighborhood } = useSearchNeighborhood(filters.neighborhood);
  const activeFilterCount = useActiveFilterCount(filters);

  const locationLabel = useMemo(() => {
    if (neighborhood) return neighborhood.name;
    if (filters.neighborhood) {
      return filters.neighborhood
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return 'Lagos';
  }, [filters.neighborhood, neighborhood]);

  const miniLocation =
    neighborhood?.city && neighborhood.name !== neighborhood.city
      ? `${neighborhood.name}, ${neighborhood.city}`
      : locationLabel;

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <SearchMiniBar
        locationLabel={miniLocation}
        datesLabel={DEMO_STAY.datesRangeLabel}
        guestsLabel={`${filters.guests} guests`}
      />

      <SearchFiltersBar
        filters={filters}
        activeFilterCount={activeFilterCount}
        onChange={setFilters}
      />

      <Grid
        templateColumns={{ base: '1fr', lg: '1fr minmax(320px, 42%)' }}
        alignItems="start"
      >
        <SearchResults
          properties={properties}
          locationLabel={locationLabel}
          nights={filters.nights}
          guests={filters.guests}
        />
        <Box
          position={{ lg: 'sticky' }}
          top={{ lg: '140px' }}
          h={{ lg: 'calc(100vh - 140px)' }}
          display={{ base: 'none', lg: 'block' }}
        >
          <SearchMap properties={properties} />
        </Box>
      </Grid>

      <MobileTabBar />
    </Box>
  );
}
