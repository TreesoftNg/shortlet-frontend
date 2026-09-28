'use client';

import { sectionMt } from '@/shared/layout';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  mt?: typeof sectionMt | number | Record<string, number | string>;
  mb?: string | number | Record<string, number | string>;
  as?: 'h2' | 'h3';
};

export function SectionHeader({
  title,
  subtitle,
  action,
  mt = sectionMt,
  mb = { base: 4, md: '22px' },
  as = 'h2',
}: SectionHeaderProps) {
  return (
    <Flex
      align={{ base: 'start', sm: 'end' }}
      justify="space-between"
      gap={3}
      mb={mb}
      mt={mt}
    >
      <Box>
        <Heading
          as={as}
          fontSize={{ base: '20px', md: '22px' }}
          fontWeight="700"
          letterSpacing="-0.01em"
        >
          {title}
        </Heading>
        {subtitle ? (
          <Text color="ink.2" fontSize={{ base: '13px', md: '14px' }}>
            {subtitle}
          </Text>
        ) : null}
      </Box>
      {action}
    </Flex>
  );
}
