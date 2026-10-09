'use client';

import type { Property, Review } from '@/data/types';
import { AppButton, EmptyState } from '@/shared/components';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { MessageSquare, Star } from 'lucide-react';

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
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const base = `${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  if (!nights) return base;
  return `${base} · Stayed ${nights} night${nights === 1 ? '' : 's'}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function PropertyReviews({ property, reviews }: PropertyReviewsProps) {
  const { rating, count, scores } = property.review_summary;
  const hasCategoryScores = Object.values(scores).some((value) => value > 0);
  const bars = [
    { label: 'Cleanliness', value: scores.cleanliness },
    { label: 'Accuracy', value: scores.accuracy },
    { label: 'Check-in', value: scores.check_in },
    { label: 'Communication', value: scores.communication },
    { label: 'Location', value: scores.location },
    { label: 'Value', value: scores.value },
  ];

  if (count === 0 && reviews.length === 0) {
    return (
      <Box mt={{ base: 8, md: 3 }} pb="60px">
        <EmptyState
          title="No reviews yet"
          description="Be the first to stay and share your experience."
          icon={<MessageSquare size={22} strokeWidth={1.9} />}
          mt={0}
        />
      </Box>
    );
  }

  return (
    <Box mt={{ base: 8, md: 3 }} pb="60px">
      <Flex
        align="center"
        gap="10px"
        fontSize={{ base: '20px', md: '24px' }}
        fontWeight="800"
        mb="20px"
      >
        <Star size={24} fill="currentColor" stroke="none" />
        {rating.toFixed(2)} · {count} review{count === 1 ? '' : 's'}
      </Flex>

      {hasCategoryScores ? (
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
              <Text
                as="b"
                display="block"
                fontSize="18px"
                mt="4px"
                fontWeight="700"
              >
                {bar.value.toFixed(1)}
              </Text>
            </Box>
          ))}
        </Grid>
      ) : null}

      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={{ base: 8, md: '36px 80px' }}
        mt="30px"
      >
        {reviews.map((review) => (
          <Box key={review.id}>
            <Flex gap="12px" align="center" mb="10px">
              <Flex
                w="44px"
                h="44px"
                borderRadius="full"
                overflow="hidden"
                flexShrink={0}
                bg="brand.50"
                color="brand.600"
                align="center"
                justify="center"
                fontSize="13px"
                fontWeight="700"
              >
                {initials(review.author_name) || 'G'}
              </Flex>
              <Box>
                <Text as="b" fontWeight="700">
                  {review.author_name}
                </Text>
                <Text color="ink.3" fontSize="13px">
                  {reviewDateLabel(review.created_at, review.stayed_nights)}
                </Text>
              </Box>
            </Flex>
            {review.body ? (
              <Text color="ink.2" fontSize="14px">
                {review.body}
              </Text>
            ) : null}
          </Box>
        ))}
      </Grid>

      {count > reviews.length ? (
        <Box mt="30px">
          <AppButton variant="outline">Show all {count} reviews</AppButton>
        </Box>
      ) : null}
    </Box>
  );
}
