'use client';

import { SearchFiltersBar } from '@/features/search/components/SearchFiltersBar';
import { SearchMap } from '@/features/search/components/SearchMap';
import { SearchMiniBar } from '@/features/search/components/SearchMiniBar';
import { SearchResults } from '@/features/search/components/SearchResults';
import {
  defaultSearchFilters,
  syncSearchNights,
  toPublicUnitsTab,
  useSearchNeighborhood,
  useSearchProperties,
  SEARCH_PAGE_SIZE,
  type SearchFilters,
} from '@/features/search/hooks/useSearchData';
import { SEARCH_CATEGORIES } from '@/features/search/lib/categories';
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { formatDatesRangeLabel } from '@/shared/lib/format';
import { Box, Grid } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = toPublicUnitsTab(searchParams.get('tab'));
  const neighborhoodParam = searchParams.get('neighborhood') ?? undefined;
  const checkInParam = searchParams.get('checkIn') ?? undefined;
  const checkOutParam = searchParams.get('checkOut') ?? undefined;
  const guestsParam = searchParams.get('guests');
  const guestsFromUrl = guestsParam ? Number(guestsParam) : undefined;
  const pageFromUrl = Number(searchParams.get('page') ?? '1');
  const pageParam =
    Number.isFinite(pageFromUrl) && pageFromUrl >= 1
      ? Math.floor(pageFromUrl)
      : 1;

  const [filters, setFilters] = useState<SearchFilters>(() =>
    syncSearchNights({
      ...defaultSearchFilters,
      tab: tabParam,
      neighborhood: neighborhoodParam,
      checkIn: checkInParam ?? defaultSearchFilters.checkIn,
      checkOut: checkOutParam ?? defaultSearchFilters.checkOut,
      guests:
        guestsFromUrl && guestsFromUrl > 0
          ? Math.min(16, guestsFromUrl)
          : defaultSearchFilters.guests,
      page: pageParam,
    }),
  );

  useEffect(() => {
    setFilters((prev) =>
      syncSearchNights({
        ...prev,
        tab: tabParam,
        neighborhood: neighborhoodParam,
        checkIn: checkInParam ?? prev.checkIn,
        checkOut: checkOutParam ?? prev.checkOut,
        guests:
          guestsFromUrl && guestsFromUrl > 0
            ? Math.min(16, guestsFromUrl)
            : prev.guests,
        page: pageParam,
      }),
    );
  }, [
    tabParam,
    neighborhoodParam,
    checkInParam,
    checkOutParam,
    guestsFromUrl,
    pageParam,
  ]);

  const {
    data: properties = [],
    meta,
    isPending: propertiesPending,
    isError: propertiesError,
    refetch: refetchProperties,
  } = useSearchProperties(filters);
  const { data: neighborhood } = useSearchNeighborhood(filters.neighborhood);

  const locationLabel = useMemo(() => {
    if (neighborhood) return neighborhood.name;
    if (filters.neighborhood) {
      return filters.neighborhood
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return 'Anywhere';
  }, [filters.neighborhood, neighborhood]);

  const miniLocation =
    neighborhood?.city && neighborhood.name !== neighborhood.city
      ? `${neighborhood.name}, ${neighborhood.city}`
      : locationLabel;

  const datesLabel = formatDatesRangeLabel(filters.checkIn, filters.checkOut);

  const handleFiltersChange = (
    next: SearchFilters,
    options?: { keepPage?: boolean },
  ) => {
    const synced = syncSearchNights({
      ...next,
      page: options?.keepPage ? Math.max(1, next.page || 1) : 1,
    });
    setFilters(synced);

    const params = new URLSearchParams();
    params.set('tab', synced.tab);
    if (synced.neighborhood) params.set('neighborhood', synced.neighborhood);
    if (synced.checkIn) params.set('checkIn', synced.checkIn);
    if (synced.checkOut) params.set('checkOut', synced.checkOut);
    if (synced.guests) params.set('guests', String(synced.guests));
    if (synced.page > 1) params.set('page', String(synced.page));
    router.replace(`/search?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (page: number) => {
    handleFiltersChange({ ...filters, page }, { keepPage: true });
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <SearchMiniBar
        filters={filters}
        locationLabel={miniLocation}
        onChange={handleFiltersChange}
      />

      <SearchFiltersBar
        categories={[...SEARCH_CATEGORIES]}
        filters={filters}
        onChange={handleFiltersChange}
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
          meta={
            meta ?? {
              page: filters.page,
              limit: SEARCH_PAGE_SIZE,
              total: properties.length,
              totalPages: 1,
            }
          }
          isPending={propertiesPending}
          isError={propertiesError}
          onRetry={() => {
            void refetchProperties();
          }}
          onClearFilters={() => {
            handleFiltersChange({
              ...defaultSearchFilters,
              neighborhood: undefined,
            });
          }}
          onPageChange={handlePageChange}
        />
        <Box
          position={{ lg: 'sticky' }}
          top={{ lg: '144px' }}
          h={{ lg: 'calc(100vh - 144px)' }}
          display={{ base: 'none', lg: 'block' }}
        >
          <SearchMap properties={properties} />
        </Box>
      </Grid>

      <MobileTabBar />
    </Box>
  );
}
