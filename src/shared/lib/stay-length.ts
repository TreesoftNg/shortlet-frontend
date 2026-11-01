import type { StayLimits } from '@/data/types';
import { addDays } from '@/shared/lib/default-stay';
import { nightsLabel, parseISODate, toISODate } from '@/shared/lib/format';

/** Limits used when a unit has none configured: any stay of 1+ nights. */
export const DEFAULT_STAY_LIMITS: StayLimits = {
  min_nights: 1,
  max_nights: null,
};

const MS_PER_DAY = 86_400_000;

/** Calendar nights from check-in to check-out (0 or negative when out of order). */
function nightsInStay(checkIn: string, checkOut: string): number {
  const start = parseISODate(checkIn).getTime();
  const end = parseISODate(checkOut).getTime();
  return Math.round((end - start) / MS_PER_DAY);
}

function addNights(iso: string, nights: number): string {
  return toISODate(addDays(parseISODate(iso), nights));
}

function minNightsOf(limits: StayLimits): number {
  return Math.max(1, limits.min_nights);
}

/** First check-out a guest may pick for this check-in (YYYY-MM-DD). */
export function earliestCheckOut(checkIn: string, limits: StayLimits): string {
  return addNights(checkIn, minNightsOf(limits));
}

/** Last check-out a guest may pick for this check-in, or null when unlimited. */
export function latestCheckOut(
  checkIn: string,
  limits: StayLimits,
): string | null {
  if (limits.max_nights === null) return null;
  return addNights(checkIn, Math.max(limits.max_nights, minNightsOf(limits)));
}

/**
 * Pull a check-out into the allowed window for its check-in: forward when the
 * stay is too short (or out of order), back when it is too long.
 */
export function fitCheckOutToLimits(
  checkIn: string,
  checkOut: string,
  limits: StayLimits,
): string {
  // YYYY-MM-DD strings sort chronologically.
  const earliest = earliestCheckOut(checkIn, limits);
  if (checkOut < earliest) return earliest;
  const latest = latestCheckOut(checkIn, limits);
  if (latest !== null && checkOut > latest) return latest;
  return checkOut;
}

/** Guest-facing reason the stay cannot be booked, or null when it fits. */
export function stayLengthProblem(
  checkIn: string,
  checkOut: string,
  limits: StayLimits,
): string | null {
  const nights = nightsInStay(checkIn, checkOut);
  const minNights = minNightsOf(limits);
  if (nights < minNights) return `Minimum stay is ${nightsLabel(minNights)}`;
  if (limits.max_nights !== null && nights > limits.max_nights) {
    return `Maximum stay is ${nightsLabel(limits.max_nights)}`;
  }
  return null;
}

/**
 * Short note for the date picker, e.g. "Minimum stay: 3 nights · Maximum
 * stay: 10 nights". Null when the unit takes any stay of 1+ nights.
 */
export function stayLimitsHint(limits: StayLimits): string | null {
  const parts: string[] = [];
  const minNights = minNightsOf(limits);
  if (minNights > 1) parts.push(`Minimum stay: ${nightsLabel(minNights)}`);
  if (limits.max_nights !== null) {
    parts.push(`Maximum stay: ${nightsLabel(limits.max_nights)}`);
  }
  return parts.length ? parts.join(' · ') : null;
}
