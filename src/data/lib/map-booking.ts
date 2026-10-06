import { toAppMediaUrl } from '@/data/lib/app-media-url';
import {
  formatDatesRangeLabel,
  nightsBetween,
  parseISODate,
  shortArea,
} from '@/shared/lib/format';
import type { Booking, BookingStatus } from '@/data/types';
import type { CreateBookingResult, ApiBooking } from '@/data/types/booking-api';

export function toMoneyNumber(value: string | number | null | undefined): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Normalise list payloads from `/me/bookings` (array or `{ items }`). */
export function asApiBookingList(payload: unknown): ApiBooking[] {
  if (Array.isArray(payload)) return payload as ApiBooking[];
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.items)) return record.items as ApiBooking[];
    if (Array.isArray(record.bookings)) return record.bookings as ApiBooking[];
    if (Array.isArray(record.data)) return record.data as ApiBooking[];
  }
  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * POST /api/v1/bookings returns `{ booking, accessToken, checkout }`.
 * Older/flat payloads are still accepted.
 */
export function normalizeCreateBookingResult(
  payload: unknown,
): CreateBookingResult {
  const record = isRecord(payload) ? payload : {};
  const nested = isRecord(record.booking) ? record.booking : record;
  const booking = nested as ApiBooking;
  const checkoutRecord = isRecord(record.checkout)
    ? record.checkout
    : isRecord(booking.checkout)
      ? booking.checkout
      : null;
  const latestPayment = isRecord(booking.latestPayment)
    ? booking.latestPayment
    : null;

  const checkout = checkoutRecord
    ? {
        ...checkoutRecord,
        checkoutUrl:
          (typeof checkoutRecord.checkoutUrl === 'string' &&
            checkoutRecord.checkoutUrl) ||
          (typeof latestPayment?.checkoutUrl === 'string' &&
            latestPayment.checkoutUrl) ||
          null,
      }
    : latestPayment?.checkoutUrl
      ? { checkoutUrl: String(latestPayment.checkoutUrl) }
      : null;

  const accessToken =
    (typeof record.accessToken === 'string' && record.accessToken) ||
    booking.accessToken ||
    null;

  return {
    ...booking,
    id: booking.id,
    accessToken,
    checkout: checkout as CreateBookingResult['checkout'],
  };
}

/**
 * Amount the guest should pay — always from the create-booking response,
 * never from a pre-create client-side quote alone.
 */
export function resolvePayableAmount(
  result: CreateBookingResult,
): number | null {
  const candidates = [
    result.checkout?.amount,
    result.checkout?.totalDueNow,
    result.totalAmount,
    result.totalDueNow,
    result.expectedTotal,
    result.stayTotal,
    result.price?.total,
    // amountPaid is 0 while pending — only use if already paid.
    result.amountPaid,
    result.totalPaid,
  ];
  for (const value of candidates) {
    const amount = toMoneyNumber(value);
    if (amount > 0) return amount;
  }
  return null;
}

function guestCount(booking: ApiBooking): number {
  if (typeof booking.guests === 'number') return booking.guests;
  if (booking.guests && typeof booking.guests === 'object') {
    return (
      (booking.guests.adults ?? 0) +
      (booking.guests.children ?? 0)
    );
  }
  return booking.adults ?? 1;
}

function mapStatus(status: string | null | undefined): BookingStatus {
  const value = (status ?? '').toLowerCase();
  if (value === 'confirmed' || value === 'completed' || value === 'cancelled') {
    return value;
  }
  if (
    value === 'pending' ||
    value === 'held' ||
    value === 'awaiting_payment' ||
    value === 'pending_payment'
  ) {
    return 'pending';
  }
  return 'pending';
}

/** Accept `YYYY-MM-DD` or full ISO datetimes from the API. */
function toDateOnly(value: string | null | undefined): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return '';
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dateTimeLabel(isoDate: string, time?: string | null): string {
  if (!isoDate) return '';
  const d = parseISODate(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  const datePart = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  if (!time) return datePart;
  return `${datePart} · ${time}`;
}

function countdownLabel(checkIn: string, status: BookingStatus): string | null {
  if (status !== 'confirmed' || !checkIn) return null;
  const start = parseISODate(checkIn).getTime();
  if (Number.isNaN(start)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((start - today.getTime()) / 86_400_000);
  if (days < 0) return null;
  if (days === 0) return 'Check-in today';
  if (days === 1) return 'Check-in tomorrow';
  return `Check-in in ${days} days`;
}

function tabForBooking(status: BookingStatus, checkOut: string): 'upcoming' | 'past' | 'cancelled' {
  if (status === 'cancelled') return 'cancelled';
  if (status === 'completed') return 'past';
  if (status === 'confirmed' && checkOut) {
    const end = parseISODate(checkOut);
    if (Number.isNaN(end.getTime())) return 'upcoming';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (end < today) return 'past';
    return 'upcoming';
  }
  if (status === 'pending') return 'upcoming';
  return 'upcoming';
}

export function bookingTab(booking: Booking): 'upcoming' | 'past' | 'cancelled' {
  return tabForBooking(booking.status, booking.check_out);
}

function bookingId(api: ApiBooking): string {
  const raw = api.id ?? api.reference;
  return raw != null && String(raw).length > 0 ? String(raw) : 'unknown';
}

/** Map API booking payload into the trips/confirmation Booking UI shape. */
export function mapApiBookingToBooking(api: ApiBooking): Booking {
  const id = bookingId(api);
  const checkIn = toDateOnly(api.checkIn);
  const checkOut = toDateOnly(api.checkOut);
  const status = mapStatus(api.status);
  const unitName = api.unit?.name ?? null;
  const city =
    api.unit?.location?.city ||
    shortArea(api.unit?.location?.display ?? '') ||
    'Nigeria';
  const location =
    api.unit?.location?.display ||
    api.unit?.location?.neighbourhood ||
    city;
  const image = toAppMediaUrl(api.unit?.pictureUrl);
  const amount = toMoneyNumber(
    api.amountPaid && toMoneyNumber(api.amountPaid) > 0
      ? api.amountPaid
      : (api.totalAmount ??
          api.totalDueNow ??
          api.expectedTotal ??
          api.stayTotal ??
          api.price?.total ??
          api.totalPaid ??
          api.amountPaid),
  );
  const nights =
    api.nights ??
    (checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 1);
  const unitOrPropertyId =
    api.property?.id || api.unitId || api.unit?.id || id;

  return {
    id,
    reference: api.reference || id.slice(0, 8).toUpperCase(),
    property_id: unitOrPropertyId,
    property_slug: api.unitId || api.unit?.id || api.property?.slug || id,
    property_name: api.unit?.name || api.property?.name || 'Stay',
    property_image: image,
    unit_label: unitName,
    location_label: location,
    city_label: city,
    check_in: checkIn,
    check_out: checkOut,
    check_in_label: dateTimeLabel(checkIn),
    check_out_label: dateTimeLabel(checkOut),
    dates_range_label:
      checkIn && checkOut
        ? formatDatesRangeLabel(checkIn, checkOut)
        : '',
    guests: guestCount(api),
    nights,
    status,
    amount_paid: amount,
    currency: api.currency || 'NGN',
    your_rating: api.yourRating ?? null,
    review_pending: Boolean(api.reviewPending),
    countdown_label: countdownLabel(checkIn, status),
  };
}
