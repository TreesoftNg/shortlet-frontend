'use client';

import type { SearchFilters } from '@/features/search/hooks/useSearchData';
import type { PropertySort } from '@/data/api';
import { Box, Flex, Text } from '@chakra-ui/react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

type SearchFiltersBarProps = {
  filters: SearchFilters;
  activeFilterCount: number;
  onChange: (next: SearchFilters) => void;
};

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Flex
      as="button"
      align="center"
      gap="6px"
      h="36px"
      px="14px"
      border="1px solid"
      borderColor={active ? 'ink' : 'line'}
      borderRadius="full"
      fontSize="13px"
      fontWeight="600"
      bg={active ? 'bg.soft' : 'white'}
      color={active ? 'ink' : 'ink.2'}
      cursor="pointer"
      flexShrink={0}
      onClick={onClick}
      whiteSpace="nowrap"
    >
      {children}
    </Flex>
  );
}

function toggleAmenity(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((a) => a !== id) : [...list, id];
}

export function SearchFiltersBar({
  filters,
  activeFilterCount,
  onChange,
}: SearchFiltersBarProps) {
  const cycleSort = () => {
    const order: PropertySort[] = [
      'recommended',
      'price_asc',
      'price_desc',
      'rating',
    ];
    const idx = order.indexOf(filters.sort);
    onChange({ ...filters, sort: order[(idx + 1) % order.length] });
  };

  const sortLabel =
    filters.sort === 'recommended'
      ? 'Recommended'
      : filters.sort === 'price_asc'
        ? 'Price ↑'
        : filters.sort === 'price_desc'
          ? 'Price ↓'
          : 'Top rated';

  return (
    <Flex
      align="center"
      gap="10px"
      px={{ base: 4, md: 8, lg: 10 }}
      py="16px"
      borderBottom="1px solid"
      borderColor="line"
      overflowX="auto"
      maxW="1440px"
      mx="auto"
      w="full"
      css={{
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Chip active={activeFilterCount > 0}>
        <SlidersHorizontal size={14} strokeWidth={1.9} />
        Filters{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
      </Chip>

      <Chip>
        Price <ChevronDown size={14} strokeWidth={1.9} />
      </Chip>

      <Chip
        active={filters.minBedrooms === 2}
        onClick={() =>
          onChange({
            ...filters,
            minBedrooms: filters.minBedrooms === 2 ? null : 2,
          })
        }
      >
        2+ Bedrooms
        {filters.minBedrooms === 2 ? <X size={14} strokeWidth={1.9} /> : null}
      </Chip>

      <Chip>Instant book</Chip>

      <Chip
        active={filters.amenities.includes('pool')}
        onClick={() =>
          onChange({
            ...filters,
            amenities: toggleAmenity(filters.amenities, 'pool'),
          })
        }
      >
        Pool
        {filters.amenities.includes('pool') ? (
          <X size={14} strokeWidth={1.9} />
        ) : null}
      </Chip>

      <Chip
        active={filters.amenities.includes('__power__')}
        onClick={() =>
          onChange({
            ...filters,
            amenities: toggleAmenity(filters.amenities, '__power__'),
          })
        }
      >
        24/7 Power
        {filters.amenities.includes('__power__') ? (
          <X size={14} strokeWidth={1.9} />
        ) : null}
      </Chip>

      <Chip
        active={filters.amenities.includes('parking')}
        onClick={() =>
          onChange({
            ...filters,
            amenities: toggleAmenity(filters.amenities, 'parking'),
          })
        }
      >
        Parking
      </Chip>

      <Chip
        active={filters.amenities.includes('wifi')}
        onClick={() =>
          onChange({
            ...filters,
            amenities: toggleAmenity(filters.amenities, 'wifi'),
          })
        }
      >
        Wi-Fi
      </Chip>

      <Box flex="1" minW="8px" display={{ base: 'none', lg: 'block' }} />

      <Chip onClick={cycleSort}>
        <Text as="span">Sort: {sortLabel}</Text>
        <ChevronDown size={14} strokeWidth={1.9} />
      </Chip>
    </Flex>
  );
}
