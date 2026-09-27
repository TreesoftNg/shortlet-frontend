'use client';

import { AppButton, SectionHeader, StatusBadge, Surface } from '@/shared/components';
import type { Booking } from '@/data/types';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type PastTripsGridProps = {
  bookings: Booking[];
  title?: string;
  showViewAll?: boolean;
};

export function PastTripsGrid({
  bookings,
  title = "Where you've been",
  showViewAll = true,
}: PastTripsGridProps) {
  if (!bookings.length) {
    return (
      <Text color="ink.2" mt={8}>
        No trips in this list yet.
      </Text>
    );
  }

  return (
    <Box>
      {title ? (
        <SectionHeader
          title={title}
          mt={{ base: 8, md: '52px' }}
          mb="20px"
          action={
            showViewAll ? (
              <Text as="u" fontWeight="700" fontSize="14px" cursor="pointer">
                View all
              </Text>
            ) : null
          }
        />
      ) : null}

      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap="22px"
      >
        {bookings.map((booking) => (
          <Surface key={booking.id} radius="lg" asChild>
            <Link href={`/properties/${booking.property_slug}`}>
              <Box position="relative" h="180px">
                <Image
                  src={booking.property_image}
                  alt={booking.property_name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Box p="16px 18px">
                <Text as="b" fontWeight="700" display="block">
                  {booking.property_name}
                </Text>
                <Text color="ink.2" fontSize="14px">
                  {booking.city_label} · {booking.dates_range_label}
                </Text>

                <Flex
                  justify="space-between"
                  align="center"
                  mt="14px"
                  gap={2}
                  flexWrap="wrap"
                >
                  <StatusBadge status={booking.status} />

                  {booking.review_pending ? (
                    <AppButton
                      variant="ink"
                      size="sm"
                      leftIcon={<Star size={14} strokeWidth={1.9} />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      Leave a review
                    </AppButton>
                  ) : booking.your_rating != null ? (
                    <Flex
                      align="center"
                      gap="4px"
                      fontWeight="600"
                      fontSize="14px"
                    >
                      <Star size={14} fill="currentColor" stroke="none" />
                      You rated {booking.your_rating.toFixed(1)}
                    </Flex>
                  ) : null}
                </Flex>
              </Box>
            </Link>
          </Surface>
        ))}
      </Grid>
    </Box>
  );
}
