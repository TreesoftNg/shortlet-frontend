import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { DEMO_STAY } from '@/data/demo-stay';
import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('usePropertyBookingStore', () => {
  beforeEach(() => {
    act(() => {
      usePropertyBookingStore.getState().reset();
    });
  });

  it('defaults guests and dates from DEMO_STAY', () => {
    expect(usePropertyBookingStore.getState().guests).toBe(DEMO_STAY.guests);
    expect(usePropertyBookingStore.getState().checkIn).toBe(DEMO_STAY.checkIn);
    expect(usePropertyBookingStore.getState().checkOut).toBe(
      DEMO_STAY.checkOut,
    );
    expect(usePropertyBookingStore.getState().selectedUnitId).toBeNull();
  });

  it('updates selected unit, guests, and dates', () => {
    act(() => {
      usePropertyBookingStore.getState().setSelectedUnitId('unit_a');
      usePropertyBookingStore.getState().setGuests(3);
      usePropertyBookingStore
        .getState()
        .setDates('2026-10-17', '2026-10-20');
    });

    expect(usePropertyBookingStore.getState().selectedUnitId).toBe('unit_a');
    expect(usePropertyBookingStore.getState().guests).toBe(3);
    expect(usePropertyBookingStore.getState().checkIn).toBe('2026-10-17');
    expect(usePropertyBookingStore.getState().checkOut).toBe('2026-10-20');
  });
});
