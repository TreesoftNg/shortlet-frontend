import {
  asApiBookingList,
  mapApiBookingToBooking,
  normalizeCreateBookingResult,
  resolvePayableAmount,
  toMoneyNumber,
} from '@/data/lib/map-booking';
import { createBooking, getMyBookings, getUnitQuote } from '@/data/api/bookings';
import { afterEach, describe, expect, it, vi } from 'vitest';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('mapApiBookingToBooking', () => {
  it('maps a confirmed booking into the trips card shape', () => {
    const booking = mapApiBookingToBooking({
      id: 'bk-1',
      reference: 'SMD-123',
      status: 'confirmed',
      checkIn: '2026-12-23',
      checkOut: '2026-12-27',
      nights: 4,
      guests: { adults: 2, children: 0, infants: 0 },
      amountPaid: '577025.00',
      currency: 'NGN',
      unitId: 'unit-1',
      unit: {
        id: 'unit-1',
        name: 'Charming 1bedroom',
        pictureUrl: 'http://localhost:4000/media/photo.webp',
        location: { city: 'Lagos', display: 'Lagos, NG' },
      },
    });

    expect(booking.reference).toBe('SMD-123');
    expect(booking.status).toBe('confirmed');
    expect(booking.unit_id).toBe('unit-1');
    expect(booking.guests).toBe(2);
    expect(booking.amount_paid).toBe(577025);
    expect(booking.property_image).toBe('https://api-staging.sunmadeapartments.com/media/photo.webp');
    expect(booking.dates_range_label).toContain('Dec');
  });

  it('tolerates missing ids and ISO datetimes', () => {
    const booking = mapApiBookingToBooking({
      reference: 'SMD-9',
      status: 'confirmed',
      checkIn: '2026-12-23T14:00:00.000Z',
      checkOut: '2026-12-27T11:00:00.000Z',
    });
    expect(booking.id).toBe('SMD-9');
    expect(booking.check_in).toBe('2026-12-23');
    expect(booking.check_out).toBe('2026-12-27');
  });
});

describe('asApiBookingList', () => {
  it('reads bare arrays and paginated items', () => {
    expect(asApiBookingList([{ id: '1' }])).toHaveLength(1);
    expect(asApiBookingList({ items: [{ id: '2' }] })).toEqual([{ id: '2' }]);
    expect(asApiBookingList(null)).toEqual([]);
  });
});

describe('toMoneyNumber', () => {
  it('parses decimal strings', () => {
    expect(toMoneyNumber('113000.00')).toBe(113000);
  });
});

describe('normalizeCreateBookingResult', () => {
  it('reads nested booking + checkout from the live API', () => {
    const result = normalizeCreateBookingResult({
      booking: { id: 'bk-1', status: 'pending_payment' },
      accessToken: 'tok',
      checkout: { checkoutUrl: 'https://pay.example' },
    });
    expect(result.id).toBe('bk-1');
    expect(result.accessToken).toBe('tok');
    expect(result.checkout?.checkoutUrl).toBe('https://pay.example');
  });

  it('resolves payable amount from the create-booking response only', () => {
    expect(
      resolvePayableAmount({
        id: 'bk-1',
        checkout: { amount: '125000.00' },
      }),
    ).toBe(125000);
    expect(
      resolvePayableAmount({
        id: 'bk-2',
        totalDueNow: '99000',
      }),
    ).toBe(99000);
    expect(
      resolvePayableAmount({
        id: 'bk-3',
        totalAmount: '445875.00',
        amountPaid: '0.00',
      }),
    ).toBe(445875);
    expect(resolvePayableAmount({ id: 'bk-4' })).toBeNull();
  });
});

describe('bookings api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches a unit quote', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          unitId: 'u1',
          checkIn: '2026-12-23',
          checkOut: '2026-12-27',
          nights: 4,
          guests: { adults: 2, children: 0, infants: 0 },
          currency: 'NGN',
          price: {
            currency: 'NGN',
            nights: 4,
            nightsSubtotal: '452000.00',
            cleaningFee: '15000.00',
            serviceFee: { amount: '0.00' },
            tax: { amount: '35025.00' },
            total: '502025.00',
          },
          deposit: { amount: '75000.00' },
          totalDueNow: '577025.00',
          houseRules: 'No smoking',
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const quote = await getUnitQuote({
      unitId: 'u1',
      checkIn: '2026-12-23',
      checkOut: '2026-12-27',
      adults: 2,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/units/u1/quote?checkIn=2026-12-23&checkOut=2026-12-27&adults=2',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(quote.totalDueNow).toBe('577025.00');
  });

  it('creates a booking with auth token when provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          success: true,
          data: {
            booking: {
              id: 'bk-9',
              status: 'pending_payment',
            },
            accessToken: 'booking-tok',
            checkout: { checkoutUrl: 'https://pay.example/checkout' },
          },
        },
        201,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await createBooking(
      {
        returnUrl: 'http://localhost:3000/confirmation',
        unitId: 'u1',
        checkIn: '2026-12-23',
        checkOut: '2026-12-27',
        adults: 2,
        guest: {
          firstName: 'Ada',
          lastName: 'Okafor',
          email: 'ada@example.com',
          phone: '+2348031234567',
        },
        acceptHouseRules: true,
        expectedTotal: 577025,
      },
      'customer-access',
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/bookings',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer customer-access',
        }),
      }),
    );
    expect(result.checkout?.checkoutUrl).toBe('https://pay.example/checkout');
    expect(result.accessToken).toBe('booking-tok');
    expect(result.id).toBe('bk-9');
  });

  it('loads my bookings from a paginated items payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        data: {
          items: [
            {
              id: 'bk-1',
              status: 'confirmed',
              checkIn: '2026-12-23',
              checkOut: '2026-12-27',
              unit: { name: 'Studio' },
            },
          ],
        },
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const list = await getMyBookings('customer-access', { limit: 100 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api-staging.sunmadeapartments.com/api/v1/me/bookings?limit=100',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer customer-access',
        }),
      }),
    );
    expect(list).toHaveLength(1);
    expect(list[0]?.property_name).toBe('Studio');
  });
});
