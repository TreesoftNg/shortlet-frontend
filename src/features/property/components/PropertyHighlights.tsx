'use client';

import type { PropertyHighlight } from '@/data/types';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  CalendarX,
  KeyRound,
  Zap,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  'key-round': KeyRound,
  'calendar-x': CalendarX,
};

type PropertyHighlightsProps = {
  highlights: PropertyHighlight[];
};

export function PropertyHighlights({ highlights }: PropertyHighlightsProps) {
  if (!highlights.length) return null;

  return (
    <Box py="28px" display="grid" gap="22px">
      {highlights.map((hl) => {
        const Icon = iconMap[hl.icon] ?? Zap;
        return (
          <Flex key={hl.title} gap="18px">
            <Box flexShrink={0} mt="2px">
              <Icon size={26} strokeWidth={1.6} />
            </Box>
            <Box>
              <Text as="b" display="block" fontWeight="700">
                {hl.title}
              </Text>
              <Text color="ink.2" fontSize="14px">
                {hl.description}
              </Text>
            </Box>
          </Flex>
        );
      })}
    </Box>
  );
}
