'use client';

import { SearchFiltersBar } from '@/features/search/components/SearchFiltersBar';
import { SearchMap } from '@/features/search/components/SearchMap';
import { SearchMiniBar } from '@/features/search/components/SearchMiniBar';
import { SearchResults } from '@/features/search/components/SearchResults';
import {
  defaultSearchFilters,
  syncSearchNights,
  useActiveFilterCount,
  useSearchNeighborhood,
  useSearchProperties,
  type SearchFilters,
} from '@/features/search/hooks/useSearchData';
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { formatDatesRangeLabel } from '@/shared/lib/format';
import { Box, Grid } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function SearchPage() {
  const router = useRouter();
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

  const {
    data: properties = [],
    isPending: propertiesPending,
    isError: propertiesError,
    refetch: refetchProperties,
  } = useSearchProperties(filters);
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

  const datesLabel = formatDatesRangeLabel(filters.checkIn, filters.checkOut);

  const handleFiltersChange = (next: SearchFilters) => {
    const synced = syncSearchNights(next);
    setFilters(synced);

    const params = new URLSearchParams(searchParams.toString());
    if (synced.neighborhood) {
      params.set('neighborhood', synced.neighborhood);
    } else {
      params.delete('neighborhood');
    }
    const query = params.toString();
    router.replace(query ? `/search?${query}` : '/search', { scroll: false });
  };

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <SearchMiniBar
        filters={filters}
        locationLabel={miniLocation}
        onChange={handleFiltersChange}
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
          datesLabel={datesLabel}
          nights={filters.nights}
          guests={filters.guests}
          isPending={propertiesPending}
          isError={propertiesError}
          onRetry={() => {
            void refetchProperties();
          }}
          onClearFilters={() => {
            setFilters({
              ...defaultSearchFilters,
              neighborhood: undefined,
            });
            router.replace('/search', { scroll: false });
          }}
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
