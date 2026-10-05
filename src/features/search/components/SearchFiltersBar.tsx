'use client';

import type { SearchFilters } from '@/features/search/hooks/useSearchData';
import { toCategoryId, toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import type { PropertySort } from '@/data/api';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  BedDouble,
  Briefcase,
  Building2,
  Castle,
  ChevronDown,
  PartyPopper,
  Sofa,
  Sparkles,
  Sunset,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type Category = {
  id: string;
  label: string;
  icon: string;
};

type SearchFiltersBarProps = {
  categories: Category[];
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
};

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  'building-2': Building2,
  'bed-double': BedDouble,
  sofa: Sofa,
  castle: Castle,
  waves: Waves,
  briefcase: Briefcase,
  'party-popper': PartyPopper,
  sunset: Sunset,
  zap: Zap,
};

export function SearchFiltersBar({
  categories,
  filters,
  onChange,
}: SearchFiltersBarProps) {
  const activeCategoryId = toCategoryId(filters.tab);

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
      py="14px"
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
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] ?? Sparkles;
        const active = cat.id === activeCategoryId;
        return (
          <Flex
            key={cat.id}
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
            whiteSpace="nowrap"
            onClick={() =>
              onChange({
                ...filters,
                tab: toPublicUnitsTab(cat.id),
              })
            }
          >
            <Icon size={14} strokeWidth={1.9} />
            {cat.label}
          </Flex>
        );
      })}

      <Box flex="1" minW="8px" display={{ base: 'none', lg: 'block' }} />

      <Flex
        as="button"
        align="center"
        gap="6px"
        h="36px"
        px="14px"
        border="1px solid"
        borderColor="line"
        borderRadius="full"
        fontSize="13px"
        fontWeight="600"
        bg="white"
        color="ink.2"
        cursor="pointer"
        flexShrink={0}
        whiteSpace="nowrap"
        onClick={cycleSort}
      >
        <Text as="span">Sort: {sortLabel}</Text>
        <ChevronDown size={14} strokeWidth={1.9} />
      </Flex>
    </Flex>
  );
}
