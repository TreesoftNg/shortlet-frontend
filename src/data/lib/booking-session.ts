const BOOKING_TOKEN_KEY = 'sunmade-booking-token';
const BOOKING_ID_KEY = 'sunmade-booking-id';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

/** Persist guest booking id/token between Flutterwave redirect hops. */
export function saveBookingSession(
  bookingId: string,
  accessToken?: string | null,
) {
  const store = storage();
  if (!store) return;
  store.setItem(BOOKING_ID_KEY, bookingId);
  if (accessToken) {
    store.setItem(BOOKING_TOKEN_KEY, accessToken);
  }
}

export function getPendingBookingId(): string | null {
  return storage()?.getItem(BOOKING_ID_KEY) ?? null;
}

export function getBookingAccessToken(bookingId?: string | null): string | null {
  const store = storage();
  if (!store) return null;
  const storedId = store.getItem(BOOKING_ID_KEY);
  const token = store.getItem(BOOKING_TOKEN_KEY);
  if (!token) return null;
  if (bookingId && storedId && storedId !== bookingId) return null;
  return token;
}

/**
 * Restore session from Flutterwave return URL params when sessionStorage
 * was cleared during the hosted checkout hop.
 */
export function restoreBookingSessionFromParams(params: {
  bookingId?: string | null;
  bookingToken?: string | null;
}): void {
  const bookingId = params.bookingId?.trim();
  const bookingToken = params.bookingToken?.trim();
  if (!bookingId || !bookingToken) return;
  saveBookingSession(bookingId, bookingToken);
}

export function clearBookingSession() {
  const store = storage();
  if (!store) return;
  store.removeItem(BOOKING_ID_KEY);
  store.removeItem(BOOKING_TOKEN_KEY);
}
