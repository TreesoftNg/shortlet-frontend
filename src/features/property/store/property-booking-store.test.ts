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

  it('defaults guests from DEMO_STAY', () => {
    expect(usePropertyBookingStore.getState().guests).toBe(DEMO_STAY.guests);
    expect(usePropertyBookingStore.getState().selectedUnitId).toBeNull();
  });

  it('updates selected unit and guests', () => {
    act(() => {
      usePropertyBookingStore.getState().setSelectedUnitId('unit_a');
      usePropertyBookingStore.getState().setGuests(3);
    });

    expect(usePropertyBookingStore.getState().selectedUnitId).toBe('unit_a');
    expect(usePropertyBookingStore.getState().guests).toBe(3);
  });
});
