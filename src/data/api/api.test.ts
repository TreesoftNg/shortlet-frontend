import { getBookings, getBookingCounts } from '@/data/api/bookings';
import { describe, expect, it } from 'vitest';

describe('bookings api', () => {
  it('returns an empty list when unsigned-in', async () => {
    const list = await getBookings();
    expect(list).toEqual([]);
  });

  it('returns empty upcoming list when unsigned-in', async () => {
    const list = await getBookings('upcoming');
    expect(list).toEqual([]);
  });

  it('returns zero counts when unsigned-in', async () => {
    const counts = await getBookingCounts();
    expect(counts).toEqual({ upcoming: 0, past: 0, cancelled: 0 });
  });
});
