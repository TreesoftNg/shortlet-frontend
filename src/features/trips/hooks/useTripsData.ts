'use client';

import { getBookingCounts, getBookings } from '@/data/api';
import { bookings } from '@/data/mocks';
import type { TripTab } from '@/data/types';
import { useQuery } from '@tanstack/react-query';

export function useBookings(tab: TripTab) {
  return useQuery({
    queryKey: ['bookings', tab],
    queryFn: () => getBookings(tab),
    initialData: () => {
      if (tab === 'upcoming') {
        return bookings.filter((b) => b.status === 'confirmed');
      }
      if (tab === 'past') {
        return bookings.filter((b) => b.status === 'completed');
      }
      return bookings.filter((b) => b.status === 'cancelled');
    },
    initialDataUpdatedAt: 0,
  });
}

export function useBookingCounts() {
  return useQuery({
    queryKey: ['bookings', 'counts'],
    queryFn: getBookingCounts,
    initialData: {
      upcoming: bookings.filter((b) => b.status === 'confirmed').length,
      past: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    },
  });
}
