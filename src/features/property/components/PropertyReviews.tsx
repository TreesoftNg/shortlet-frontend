'use client';

import type { Property, Review } from '@/data/types';
import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import { Star } from 'lucide-react';
import Image from 'next/image';

type PropertyReviewsProps = {
  property: Property;
  reviews: Review[];
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function reviewDateLabel(iso: string, nights: number): string {
  const d = new Date(iso);
  return `${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()} · Stayed ${nights} night${nights === 1 ? '' : 's'}`;
}

export function PropertyReviews({ property, reviews }: PropertyReviewsProps) {
  const { rating, count, scores } = property.review_summary;
  const bars = [
    { label: 'Cleanliness', value: scores.cleanliness },
    { label: 'Accuracy', value: scores.accuracy },
    { label: 'Check-in', value: scores.check_in },
    { label: 'Communication', value: scores.communication },
    { label: 'Location', value: scores.location },
    { label: 'Value', value: scores.value },
  ];

  return (
    <Box mt={{ base: 8, md: 3 }} pb="60px">
      <Flex align="center" gap="10px" fontSize={{ base: '20px', md: '24px' }} fontWeight="800" mb="20px">
        <Star size={24} fill="currentColor" stroke="none" />
        {rating.toFixed(2)} · {count} reviews
      </Flex>

      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(6, 1fr)',
        }}
        gap={{ base: 4, lg: '20px' }}
        pb="28px"
        borderBottom="1px solid"
        borderColor="line"
      >
        {bars.map((bar, i) => (
          <Box
            key={bar.label}
            fontSize="14px"
            borderRightWidth={{
              base: i % 2 === 0 ? '1px' : 0,
              md: i % 3 !== 2 ? '1px' : 0,
              lg: i < bars.length - 1 ? '1px' : 0,
            }}
            borderColor="line"
            pr={{ base: 3, lg: 0 }}
          >
            {bar.label}
            <Text as="b" display="block" fontSize="18px" mt="4px" fontWeight="700">
              {bar.value.toFixed(1)}
            </Text>
          </Box>
        ))}
      </Grid>

      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={{ base: 8, md: '36px 80px' }}
        mt="30px"
      >
        {reviews.map((review) => (
          <Box key={review.id}>
            <Flex gap="12px" align="center" mb="10px">
              <Box
                position="relative"
                w="44px"
                h="44px"
                borderRadius="full"
                overflow="hidden"
                flexShrink={0}
              >
                <Image
                  src={review.author_avatar}
                  alt={review.author_name}
                  fill
                  sizes="44px"
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Box>
                <Text as="b" fontWeight="700">
                  {review.author_name}
                </Text>
                <Text color="ink.3" fontSize="13px">
                  {reviewDateLabel(review.created_at, review.stayed_nights)}
                </Text>
              </Box>
            </Flex>
            <Text color="ink.2" fontSize="14px">
              {review.body}
            </Text>
          </Box>
        ))}
      </Grid>

      <Button
        mt="30px"
        h="48px"
        px="22px"
        borderRadius="12px"
        border="1px solid"
        borderColor="ink"
        bg="white"
        fontWeight="700"
        fontSize="15px"
      >
        Show all {count} reviews
      </Button>
    </Box>
  );
}
