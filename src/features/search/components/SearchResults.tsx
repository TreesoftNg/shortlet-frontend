'use client';

import { PropertyCard } from '@/shared/components/PropertyCard';
import {
  EmptyState,
  ErrorState,
  PropertyCardSkeletonGrid,
} from '@/shared/components';
import { useSearchUiStore } from '@/features/search/store/search-ui-store';
import { paginationItems } from '@/shared/lib/pagination';
import type { PublicUnitsListMeta, Property } from '@/data/types';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type SearchResultsProps = {
  properties: Property[];
  locationLabel: string;
  datesLabel: string;
  nights: number;
  guests: number;
  meta: PublicUnitsListMeta;
  isPending?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onPageChange?: (page: number) => void;
};

export function SearchResults({
  properties,
  locationLabel,
  datesLabel,
  nights,
  guests,
  meta,
  isPending,
  isError,
  onRetry,
  onClearFilters,
  onPageChange,
}: SearchResultsProps) {
  const activePropertyId = useSearchUiStore((s) => s.activePropertyId);
  const setActivePropertyId = useSearchUiStore((s) => s.setActivePropertyId);
  const total = meta.total;
  const totalPages = Math.max(1, meta.totalPages);
  const currentPage = Math.min(Math.max(1, meta.page), totalPages);
  const showPager = totalPages > 1 && Boolean(onPageChange);

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
            : `${total} apartment${total === 1 ? '' : 's'}${locationLabel ? ` in ${locationLabel}` : ''}`}
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

      {!isPending && !isError && properties.length > 0 && showPager ? (
        <Flex justify="center" align="center" gap="8px" mt="40px" mb="10px">
          <PageButton
            label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </PageButton>
          {paginationItems(currentPage, totalPages).map((item, index) =>
            item.type === 'ellipsis' ? (
              <Flex
                key={`ellipsis-${index}`}
                w="38px"
                h="38px"
                align="center"
                justify="center"
                fontWeight="600"
                fontSize="14px"
                color="ink.3"
              >
                …
              </Flex>
            ) : (
              <PageButton
                key={item.page}
                label={`Page ${item.page}`}
                active={item.page === currentPage}
                onClick={() => onPageChange?.(item.page)}
              >
                {item.page}
              </PageButton>
            ),
          )}
          <PageButton
            label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </PageButton>
        </Flex>
      ) : null}
    </Box>
  );
}

function PageButton({
  children,
  label,
  onClick,
  active = false,
  disabled = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Box
      as="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w="38px"
      h="38px"
      borderRadius="full"
      fontWeight="600"
      fontSize="14px"
      bg={active ? 'ink' : 'transparent'}
      color={active ? 'white' : 'ink'}
      opacity={disabled ? 0.35 : 1}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      border="none"
      _hover={disabled || active ? undefined : { bg: 'bg.soft' }}
      {...({
        type: 'button',
        disabled,
        onClick: disabled ? undefined : onClick,
      } as object)}
    >
      {children}
    </Box>
  );
}
