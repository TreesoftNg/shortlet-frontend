'use client';

import { getBookings } from '@/data/api';
import { bookings } from '@/data/mocks';
import { useQuery } from '@tanstack/react-query';

export function useAllBookings() {
  return useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: () => getBookings(),
    initialData: bookings,
    initialDataUpdatedAt: 0,
  });
}
