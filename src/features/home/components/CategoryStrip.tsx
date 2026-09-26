'use client';

import { pagePx } from '@/shared/layout';
import { Flex, Text } from '@chakra-ui/react';
import {
  BedDouble,
  Briefcase,
  Building2,
  Castle,
  PartyPopper,
  Sofa,
  Sparkles,
  Sunset,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react';

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

/** Shorter labels on very small screens. */
const shortLabels: Record<string, string> = {
  all: 'All',
  studios: 'Studios',
  '1-bedroom': '1 Bed',
  '2-bedroom': '2 Bed',
  penthouses: 'Penthouse',
  pool: 'Pool',
  business: 'Business',
  events: 'Events',
  waterfront: 'Waterfront',
  power: 'Power',
};

type Category = {
  id: string;
  label: string;
  icon: string;
};

type CategoryStripProps = {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function CategoryStrip({
  categories,
  activeId,
  onSelect,
}: CategoryStripProps) {
  return (
    <Flex
      gap={{ base: '22px', md: '30px', lg: '38px' }}
      px={pagePx}
      pt={{ base: 3, md: 6, lg: '34px' }}
      pb="10px"
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
        const active = cat.id === activeId;
        return (
          <Flex
            key={cat.id}
            as="button"
            direction="column"
            align="center"
            gap={{ base: '5px', md: '8px' }}
            fontSize={{ base: '11px', md: '13px' }}
            fontWeight="600"
            color={active ? 'ink' : 'ink.3'}
            pb={{ base: '10px', md: '14px' }}
            borderBottom={active ? '2px solid' : '2px solid transparent'}
            borderColor={active ? 'ink' : 'transparent'}
            flexShrink={0}
            cursor="pointer"
            bg="transparent"
            borderTop="none"
            borderLeft="none"
            borderRight="none"
            onClick={() => onSelect(cat.id)}
          >
            <Icon size={22} strokeWidth={1.6} />
            <Text as="span" display={{ base: 'none', sm: 'inline' }}>
              {cat.label}
            </Text>
            <Text as="span" display={{ base: 'inline', sm: 'none' }}>
              {shortLabels[cat.id] ?? cat.label}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
}
