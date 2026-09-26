'use client';

import type { TripTab } from '@/data/types';
import { Flex, Text } from '@chakra-ui/react';

type TripsTabsProps = {
  active: TripTab;
  counts: Record<TripTab, number>;
  onChange: (tab: TripTab) => void;
};

const labels: { id: TripTab; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function TripsTabs({ active, counts, onChange }: TripsTabsProps) {
  return (
    <Flex gap="8px" my={{ base: 4, md: '22px' }} mb={{ base: 5, md: '30px' }} overflowX="auto">
      {labels.map((tab) => {
        const on = tab.id === active;
        return (
          <Flex
            key={tab.id}
            as="button"
            px="18px"
            py="10px"
            borderRadius="full"
            fontWeight="700"
            fontSize="14px"
            bg={on ? 'ink' : 'bg.soft'}
            color={on ? 'white' : 'ink.2'}
            cursor="pointer"
            border="none"
            flexShrink={0}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            <Text as="span" ml={1}>
              · {counts[tab.id]}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
}
