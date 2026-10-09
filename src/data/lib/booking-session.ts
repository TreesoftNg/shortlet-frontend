const BOOKING_TOKEN_KEY = 'sunmade-booking-token';
const BOOKING_ID_KEY = 'sunmade-booking-id';

/** Persist guest booking id/token between Flutterwave redirect hops. */
export function saveBookingSession(
  bookingId: string,
  accessToken?: string | null,
) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(BOOKING_ID_KEY, bookingId);
  if (accessToken) {
    sessionStorage.setItem(BOOKING_TOKEN_KEY, accessToken);
  }
}

export function getPendingBookingId(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(BOOKING_ID_KEY);
}

export function getBookingAccessToken(bookingId?: string | null): string | null {
  if (typeof window === 'undefined') return null;
  const storedId = sessionStorage.getItem(BOOKING_ID_KEY);
  const token = sessionStorage.getItem(BOOKING_TOKEN_KEY);
  if (!token) return null;
  if (bookingId && storedId && storedId !== bookingId) return null;
  return token;
}

export function clearBookingSession() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(BOOKING_ID_KEY);
  sessionStorage.removeItem(BOOKING_TOKEN_KEY);
}
