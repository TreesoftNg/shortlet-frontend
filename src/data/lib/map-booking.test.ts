import { mapApiBookingToBooking } from '@/data/lib/map-booking';
import type { ApiBooking } from '@/data/types/booking-api';
import { describe, expect, it } from 'vitest';

const apiBooking = (unit: ApiBooking['unit']): ApiBooking => ({
  id: 'booking-1',
  reference: 'K7QH2MXP4D',
  status: 'confirmed',
  checkIn: '2026-11-10',
  checkOut: '2026-11-13',
  unit,
});

describe('mapApiBookingToBooking location', () => {
  it("uses the unit's street address for the location and directions", () => {
    const booking = mapApiBookingToBooking(
      apiBooking({
        id: 'unit-1',
        name: 'Lekki 2-Bed',
        address: '  5 Admiralty Way, Lekki, Lagos ',
      }),
    );

    expect(booking.address).toBe('5 Admiralty Way, Lekki, Lagos');
    expect(booking.location_label).toBe('5 Admiralty Way, Lekki, Lagos');
    expect(booking.city_label).toBe('Lekki');
  });

  it('has no address when the API sends none, and keeps the old labels', () => {
    const booking = mapApiBookingToBooking(
      apiBooking({
        id: 'unit-1',
        name: 'Lekki 2-Bed',
        address: null,
        location: { city: 'Lagos', display: 'Lekki, Lagos' },
      }),
    );

    expect(booking.address).toBeNull();
    expect(booking.location_label).toBe('Lekki, Lagos');
    expect(booking.city_label).toBe('Lagos');
  });
});
