'use client';

import { badgeLabel, formatLocation } from '@/shared/lib/format';
import { tokens } from '@/shared/theme/tokens';
import type { Property } from '@/data/types';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { Award, Heart, Share, Star } from 'lucide-react';
import { useState } from 'react';

type PropertyTitleProps = {
  property: Property;
};

export function PropertyTitle({ property }: PropertyTitleProps) {
  const [saved, setSaved] = useState(false);
  const badge = property.badges[0];

  return (
    <Flex
      justify="space-between"
      align={{ base: 'start', md: 'end' }}
      gap={4}
      direction={{ base: 'column', md: 'row' }}
      my={{ base: 5, md: '28px' }}
    >
      <Box>
        <Heading
          as="h1"
          fontSize={{ base: '24px', md: '28px', lg: '30px' }}
          fontWeight="800"
          letterSpacing="-0.02em"
          lineHeight="1.2"
        >
          {property.public_name}
        </Heading>
        <Flex
          mt="6px"
          gap="10px"
          align="center"
          flexWrap="wrap"
          fontSize="14px"
          color="ink.2"
        >
          <Flex align="center" gap="4px" fontWeight="600" color="ink">
            <Star size={14} fill="currentColor" stroke="none" />
            {property.review_summary.rating.toFixed(2)}
          </Flex>
          <Text>·</Text>
          <Text textDecoration="underline" fontWeight="600" color="ink">
            {property.review_summary.count} reviews
          </Text>
          {badge ? (
            <>
              <Text>·</Text>
              <Flex
                align="center"
                gap="5px"
                px="10px"
                py="4px"
                borderRadius="full"
                bg="brand.50"
                color="brand.600"
                fontSize="12px"
                fontWeight="700"
              >
                <Award size={14} strokeWidth={1.9} />
                {badgeLabel(badge)}
              </Flex>
            </>
          ) : null}
          <Text>·</Text>
          <Text textDecoration="underline" fontWeight="600" color="ink">
            {formatLocation(property.address.display)}
          </Text>
        </Flex>
      </Box>

      <Flex gap="18px" fontWeight="600" fontSize="14px" flexShrink={0}>
        <Flex as="button" align="center" gap="6px" textDecoration="underline" bg="transparent" border="none" cursor="pointer">
          <Share size={16} strokeWidth={1.9} />
          Share
        </Flex>
        <Flex
          as="button"
          align="center"
          gap="6px"
          textDecoration="underline"
          bg="transparent"
          border="none"
          cursor="pointer"
          onClick={() => setSaved((v) => !v)}
        >
          <Heart
            size={16}
            strokeWidth={1.9}
            fill={saved ? tokens.colors.brand[500] : 'none'}
            color={saved ? tokens.colors.brand[500] : 'currentColor'}
          />
          Save
        </Flex>
      </Flex>
    </Flex>
  );
}
