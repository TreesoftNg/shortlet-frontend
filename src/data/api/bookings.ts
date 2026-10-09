import { ApiError, http } from '@/data/api/http';
import { getBookingAccessToken } from '@/data/lib/booking-session';
import {
  asApiBookingList,
  bookingTab,
  mapApiBookingToBooking,
  normalizeCreateBookingResult,
} from '@/data/lib/map-booking';
import type { Booking, TripTab } from '@/data/types';
import type {
  ApiBooking,
  CancelBookingInput,
  CreateBookingInput,
  CreateBookingResult,
  BookingQuote,
  VerifyBookingPaymentInput,
} from '@/data/types/booking-api';

export type {
  BookingQuote,
  CreateBookingInput,
  CreateBookingResult,
} from '@/data/types/booking-api';

function authOptions(token?: string | null, bookingToken?: string | null) {
  return {
    token: token || null,
    bookingToken: bookingToken || null,
  };
}

/** GET /api/v1/units/:unitId/quote */
export async function getUnitQuote(params: {
  unitId: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  infants?: number;
}): Promise<BookingQuote> {
  const qs = new URLSearchParams({
    checkIn: params.checkIn,
    checkOut: params.checkOut,
  });
  if (params.adults != null) qs.set('adults', String(params.adults));
  if (params.children != null) qs.set('children', String(params.children));
  if (params.infants != null) qs.set('infants', String(params.infants));

  return http<BookingQuote>(
    `/api/v1/units/${encodeURIComponent(params.unitId)}/quote?${qs}`,
  );
}

/** POST /api/v1/bookings — hold dates and open payment. */
export async function createBooking(
  input: CreateBookingInput,
  accessToken?: string | null,
): Promise<CreateBookingResult> {
  const payload = await http<unknown>('/api/v1/bookings', {
    body: input,
    ...authOptions(accessToken),
  });
  return normalizeCreateBookingResult(payload);
}

/** GET /api/v1/bookings/:id — guest booking (bearer or x-booking-token). */
export async function getGuestBooking(
  bookingId: string,
  options: { accessToken?: string | null; bookingToken?: string | null } = {},
): Promise<Booking | null> {
  try {
    const bookingToken =
      options.bookingToken ?? getBookingAccessToken(bookingId);
    const api = await http<ApiBooking>(
      `/api/v1/bookings/${encodeURIComponent(bookingId)}`,
      authOptions(options.accessToken, bookingToken),
    );
    return mapApiBookingToBooking(api);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** POST /api/v1/bookings/:id/payments/verify */
export async function verifyBookingPayment(
  bookingId: string,
  input: VerifyBookingPaymentInput = {},
  options: { accessToken?: string | null; bookingToken?: string | null } = {},
): Promise<Booking> {
  const bookingToken =
    options.bookingToken ?? getBookingAccessToken(bookingId);
  const api = await http<ApiBooking>(
    `/api/v1/bookings/${encodeURIComponent(bookingId)}/payments/verify`,
    {
      body: input,
      ...authOptions(options.accessToken, bookingToken),
    },
  );
  return mapApiBookingToBooking(api);
}

/** POST /api/v1/bookings/:id/cancel */
export async function cancelBooking(
  bookingId: string,
  input: CancelBookingInput = {},
  options: { accessToken?: string | null; bookingToken?: string | null } = {},
): Promise<Booking> {
  const bookingToken =
    options.bookingToken ?? getBookingAccessToken(bookingId);
  const api = await http<ApiBooking>(
    `/api/v1/bookings/${encodeURIComponent(bookingId)}/cancel`,
    {
      body: input,
      ...authOptions(options.accessToken, bookingToken),
    },
  );
  return mapApiBookingToBooking(api);
}

/** GET /api/v1/me/bookings — signed-in customer trips. */
export async function getMyBookings(
  accessToken: string,
  params: { page?: number; limit?: number } = {},
): Promise<Booking[]> {
  const qs = new URLSearchParams();
  if (params.page != null) qs.set('page', String(params.page));
  if (params.limit != null) qs.set('limit', String(params.limit));
  const suffix = qs.toString() ? `?${qs}` : '';
  const payload = await http<unknown>(`/api/v1/me/bookings${suffix}`, {
    token: accessToken,
  });
  return asApiBookingList(payload).map(mapApiBookingToBooking);
}

/** GET /api/v1/me/bookings/:id */
export async function getMyBookingById(
  bookingId: string,
  accessToken: string,
): Promise<Booking | null> {
  try {
    const api = await http<ApiBooking>(
      `/api/v1/me/bookings/${encodeURIComponent(bookingId)}`,
      { token: accessToken },
    );
    return mapApiBookingToBooking(api);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

function filterByTab(list: Booking[], tab: TripTab): Booking[] {
  return list.filter((booking) => bookingTab(booking) === tab);
}

/** Customer trips list (requires auth). Falls back to empty when unsigned-in. */
export async function getBookings(
  tab?: TripTab,
  accessToken?: string | null,
): Promise<Booking[]> {
  if (!accessToken) return [];
  const list = await getMyBookings(accessToken, { limit: 100 });
  if (!tab) return list;
  return filterByTab(list, tab);
}

export async function getBookingById(
  id: string,
  accessToken?: string | null,
): Promise<Booking | null> {
  if (accessToken) {
    const mine = await getMyBookingById(id, accessToken);
    if (mine) return mine;
  }
  return getGuestBooking(id, { accessToken });
}

export async function getBookingCounts(
  accessToken?: string | null,
): Promise<Record<TripTab, number>> {
  const list = accessToken ? await getMyBookings(accessToken, { limit: 100 }) : [];
  return {
    upcoming: filterByTab(list, 'upcoming').length,
    past: filterByTab(list, 'past').length,
    cancelled: filterByTab(list, 'cancelled').length,
  };
}
