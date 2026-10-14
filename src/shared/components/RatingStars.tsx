'use client';

import { Flex, Text } from '@chakra-ui/react';
import { Star } from 'lucide-react';

type RatingStarsProps = {
  rating: number;
  count: number;
  /** When true, append "(N)" after the rating. */
  showCount?: boolean;
  fontSize?: string;
  starSize?: number;
};

/**
 * Guest-facing star + rating. Shows "New" when there are no published reviews
 * so cards never display a misleading 0.0.
 */
export function RatingStars({
  rating,
  count,
  showCount = false,
  fontSize = '14px',
  starSize = 14,
}: RatingStarsProps) {
  if (count <= 0) {
    return (
      <Text
        as="span"
        fontWeight="600"
        fontSize={fontSize}
        color="ink.2"
        flexShrink={0}
      >
        New
      </Text>
    );
  }

  const digits = rating % 1 === 0 ? 1 : 2;

  return (
    <Flex
      as="span"
      align="center"
      gap="4px"
      fontWeight="600"
      fontSize={fontSize}
      flexShrink={0}
    >
      <Box as="span" display="inline-flex" lineHeight={0}>
        <Star size={starSize} fill="currentColor" stroke="none" />
      </Box>
      {rating.toFixed(digits)}
      {showCount ? (
        <Text as="span" color="ink.3" fontWeight="500">
          ({count})
        </Text>
      ) : null}
    </Flex>
  );
}
