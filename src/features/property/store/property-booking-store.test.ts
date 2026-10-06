import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { getDefaultStay } from '@/shared/lib/default-stay';
import { beforeEach, describe, expect, it } from 'vitest';

describe('usePropertyBookingStore', () => {
  beforeEach(() => {
    usePropertyBookingStore.getState().reset();
  });

  it('defaults guests and dates from today-based stay defaults', () => {
    const stay = getDefaultStay();
    expect(usePropertyBookingStore.getState().guests).toBe(stay.guests);
    expect(usePropertyBookingStore.getState().checkIn).toBe(stay.checkIn);
    expect(usePropertyBookingStore.getState().checkOut).toBe(stay.checkOut);
  });

  it('updates selected unit, guests and dates', () => {
    usePropertyBookingStore.getState().setSelectedUnitId('unit-1');
    usePropertyBookingStore.getState().setGuests(4);
    usePropertyBookingStore
      .getState()
      .setDates('2026-11-01', '2026-11-05');

    expect(usePropertyBookingStore.getState().selectedUnitId).toBe('unit-1');
    expect(usePropertyBookingStore.getState().guests).toBe(4);
    expect(usePropertyBookingStore.getState().checkIn).toBe('2026-11-01');
    expect(usePropertyBookingStore.getState().checkOut).toBe('2026-11-05');
  });
});
