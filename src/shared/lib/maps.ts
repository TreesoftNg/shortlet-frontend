import type { Booking } from '@/data/types';

/**
 * Google Maps search for a place or address. This keyless URL opens the
 * Google Maps app on phones and the website elsewhere. Null when empty.
 */
export function googleMapsSearchUrl(
  query: string | null | undefined,
): string | null {
  const trimmed = query?.trim();
  if (!trimmed) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

/** Where the "Directions" button takes a guest: the apartment's address on Google Maps. */
export function directionsUrl(booking: Pick<Booking, 'address'>): string | null {
  return googleMapsSearchUrl(booking.address);
}
