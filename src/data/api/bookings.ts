import { bookings } from '@/data/mocks';
import type { Booking, TripTab } from '@/data/types';

const delay = (ms = 200) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export async function getBookings(tab?: TripTab): Promise<Booking[]> {
  await delay();

  if (!tab) return bookings;

  return bookings.filter((booking) => {
    if (tab === 'upcoming') return booking.status === 'confirmed';
    if (tab === 'past') return booking.status === 'completed';
    if (tab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });
}

export async function getBookingById(id: string): Promise<Booking | null> {
  await delay();
  return bookings.find((b) => b.id === id) ?? null;
}

export async function getBookingCounts(): Promise<Record<TripTab, number>> {
  await delay();
  return {
    upcoming: bookings.filter((b) => b.status === 'confirmed').length,
    past: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };
}
