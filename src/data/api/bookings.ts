import { request } from '@/data/api/client';
import { bookings } from '@/data/mocks';
import type { Booking, TripTab } from '@/data/types';

function filterByTab(list: Booking[], tab: TripTab): Booking[] {
  return list.filter((booking) => {
    if (tab === 'upcoming') return booking.status === 'confirmed';
    if (tab === 'past') return booking.status === 'completed';
    if (tab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });
}

export async function getBookings(tab?: TripTab): Promise<Booking[]> {
  if (!tab) return request(bookings);
  return request(filterByTab(bookings, tab));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  return request(bookings.find((b) => b.id === id) ?? null);
}

export async function getBookingCounts(): Promise<Record<TripTab, number>> {
  return request({
    upcoming: filterByTab(bookings, 'upcoming').length,
    past: filterByTab(bookings, 'past').length,
    cancelled: filterByTab(bookings, 'cancelled').length,
  });
}
