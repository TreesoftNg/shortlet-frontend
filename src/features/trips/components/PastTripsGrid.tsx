'use client';

import { LeaveReviewDialog } from '@/features/trips/components/LeaveReviewDialog';
import { AppButton, EmptyState, SectionHeader, StatusBadge, Surface } from '@/shared/components';
import { CoverImage } from '@/shared/components/CoverImage';
import type { Booking } from '@/data/types';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { CalendarDays, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type PastTripsGridProps = {
  bookings: Booking[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function PastTripsGrid({
  bookings,
  title = "Where you've been",
  showViewAll = true,
  onViewAll,
  emptyTitle = 'No trips in this list yet',
  emptyDescription = 'When you have trips here, they will show up in this grid.',
}: PastTripsGridProps) {
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  if (!bookings.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Explore stays"
        actionHref="/search"
        icon={<CalendarDays size={22} strokeWidth={1.9} />}
      />
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
              <Text
                as="button"
                fontWeight="700"
                fontSize="14px"
                cursor="pointer"
                textDecoration="underline"
                bg="transparent"
                border="none"
                p={0}
                color="inherit"
                onClick={onViewAll}
              >
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
            <Link href={`/bookings/${booking.id}`}>
              <Box position="relative" h="180px">
                <CoverImage
                  src={booking.property_image}
                  alt={booking.property_name}
                  sizes="(max-width: 640px) 100vw, 33vw"
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
                        setReviewBooking(booking);
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

      <LeaveReviewDialog
        booking={reviewBooking}
        open={Boolean(reviewBooking)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setReviewBooking(null);
        }}
      />
    </Box>
  );
}
