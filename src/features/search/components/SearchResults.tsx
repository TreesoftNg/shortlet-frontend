'use client';

import { PropertyCard } from '@/shared/components/PropertyCard';
import {
  EmptyState,
  ErrorState,
  PropertyCardSkeletonGrid,
} from '@/shared/components';
import { useSearchUiStore } from '@/features/search/store/search-ui-store';
import type { Property } from '@/data/types';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';

type SearchResultsProps = {
  properties: Property[];
  locationLabel: string;
  datesLabel: string;
  nights: number;
  guests: number;
  isPending?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onClearFilters?: () => void;
};

export function SearchResults({
  properties,
  locationLabel,
  datesLabel,
  nights,
  guests,
  isPending,
  isError,
  onRetry,
  onClearFilters,
}: SearchResultsProps) {
  const activePropertyId = useSearchUiStore((s) => s.activePropertyId);
  const setActivePropertyId = useSearchUiStore((s) => s.setActivePropertyId);

  return (
    <Box
      as="section"
      px={{ base: 4, md: 6, lg: 10 }}
      py={{ base: 5, md: '26px' }}
      pb={{ base: '100px', lg: '26px' }}
    >
      <Box>
        <Heading
          as="h1"
          fontSize={{ base: '20px', md: '22px' }}
          fontWeight="700"
          letterSpacing="-0.01em"
        >
          {isPending
            ? 'Searching apartments'
            : `${properties.length} apartment${properties.length === 1 ? '' : 's'}${locationLabel ? ` in ${locationLabel}` : ''}`}
        </Heading>
        <Text color="ink.2" fontSize="14px" mt={1}>
          {datesLabel} · {nights} night{nights === 1 ? '' : 's'} · {guests}{' '}
          guest{guests === 1 ? '' : 's'} · Prices include all fees
        </Text>
      </Box>

      {isPending ? (
        <Box mt="20px">
          <PropertyCardSkeletonGrid count={6} />
        </Box>
      ) : isError ? (
        <ErrorState
          title="Couldn’t load apartments"
          description="Search results are temporarily unavailable. Try again in a moment."
          onRetry={onRetry}
        />
      ) : properties.length === 0 ? (
        <EmptyState
          title="No apartments match these filters"
          description="Try clearing a filter or searching a different area."
          actionLabel="Clear filters"
          onAction={onClearFilters}
          icon={<Building2 size={22} strokeWidth={1.9} />}
        />
      ) : (
        <Grid
          templateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          gap={{ base: 5, md: '26px 22px' }}
          mt="20px"
        >
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="search"
              nights={nights}
              isActive={property.id === activePropertyId}
              onHover={setActivePropertyId}
            />
          ))}
        </Grid>
      )}

      {!isPending && !isError && properties.length > 0 ? (
        <Flex justify="center" gap="8px" mt="40px" mb="10px">
          {[
            { label: <ChevronLeft size={16} />, key: 'prev' },
            { label: '1', key: '1', on: true },
            { label: '2', key: '2' },
            { label: '3', key: '3' },
            { label: '…', key: 'ellipsis' },
            { label: '8', key: '8' },
            { label: <ChevronRight size={16} />, key: 'next' },
          ].map((page) => (
            <Flex
              key={page.key}
              w="38px"
              h="38px"
              borderRadius="full"
              align="center"
              justify="center"
              fontWeight="600"
              fontSize="14px"
              bg={page.on ? 'ink' : 'transparent'}
              color={page.on ? 'white' : 'ink'}
            >
              {page.label}
            </Flex>
          ))}
        </Flex>
      ) : null}
    </Box>
  );
}
