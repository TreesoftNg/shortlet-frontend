'use client';

import { Box, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  maxW?: string;
  size?: 'marketing' | 'app';
  mb?: { base: number; md: number } | number;
};

export function PageHero({
  eyebrow,
  title,
  description,
  maxW = '720px',
  size = 'marketing',
  mb = { base: 8, md: 10 },
}: PageHeroProps) {
  const isApp = size === 'app';

  return (
    <Box maxW={maxW} mb={mb}>
      {eyebrow ? (
        <Text
          fontSize="13px"
          fontWeight="700"
          color="brand.500"
          textTransform="uppercase"
          letterSpacing="0.06em"
        >
          {eyebrow}
        </Text>
      ) : null}
      <Heading
        as="h1"
        mt={eyebrow ? '10px' : 0}
        fontSize={
          isApp
            ? { base: '28px', md: '34px' }
            : { base: '32px', md: '42px' }
        }
        fontWeight="800"
        letterSpacing={isApp ? '-0.02em' : '-0.03em'}
        lineHeight="1.15"
      >
        {title}
      </Heading>
      {description ? (
        <Text
          color="ink.2"
          fontSize={isApp ? '15px' : { base: '15px', md: '16px' }}
          mt={isApp ? '6px' : '14px'}
        >
          {description}
        </Text>
      ) : null}
    </Box>
  );
}
