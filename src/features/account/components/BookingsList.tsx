'use client';

import { BookingListCard } from '@/shared/components/BookingListCard';
import type { Booking } from '@/data/types';
import { Flex, Text } from '@chakra-ui/react';

type BookingsListProps = {
  bookings: Booking[];
};

export function BookingsList({ bookings }: BookingsListProps) {
  if (!bookings.length) {
    return (
      <Text color="ink.2" mt={2}>
        No bookings yet. Explore stays to plan your next trip.
      </Text>
    );
  }

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime(),
  );

  return (
    <Flex direction="column" gap="12px">
      {sorted.map((booking) => (
        <BookingListCard key={booking.id} booking={booking} />
      ))}
    </Flex>
  );
}
