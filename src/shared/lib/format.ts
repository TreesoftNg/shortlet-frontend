import type { PropertyBadge } from '@/data/types';

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

/** Compact map pin label, e.g. 85000 → ₦85k */
export function formatNairaShort(amount: number): string {
  if (amount >= 1000) {
    return `₦${Math.round(amount / 1000)}k`;
  }
  return formatNaira(amount);
}

export function formatLocation(display: string): string {
  return display.replace(/,\s*NG$/i, '');
}

export function shortArea(display: string): string {
  return display.split(',')[0]?.trim() ?? display;
}

export function badgeLabel(badge: PropertyBadge): string {
  switch (badge) {
    case 'guest_favourite':
      return 'Guest favourite';
    case 'new':
      return 'New';
    case 'only_1_left':
      return 'Only 1 left';
    default:
      return badge;
  }
}

export function bedsGuestsLabel(
  beds: number | null,
  guests: number | null,
): string {
  const bedPart = beds === 1 ? '1 bed' : `${beds ?? 0} beds`;
  const guestPart = guests === 1 ? '1 guest' : `${guests ?? 0} guests`;
  return `${bedPart} · ${guestPart}`;
}

export function bedsOnlyLabel(beds: number | null): string {
  return beds === 1 ? '1 bed' : `${beds ?? 0} beds`;
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = parseISODate(checkIn).getTime();
  const end = parseISODate(checkOut).getTime();
  return Math.max(1, Math.round((end - start) / 86_400_000));
}

/** e.g. Oct 12 – 16 or Oct 28 – Nov 2 */
export function formatDatesRangeLabel(checkIn: string, checkOut: string): string {
  const start = parseISODate(checkIn);
  const end = parseISODate(checkOut);
  const sameMonth = start.getMonth() === end.getMonth();
  const withMonth = { month: 'short' as const, day: 'numeric' as const };
  const dayOnly = { day: 'numeric' as const };
  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', withMonth)} – ${end.toLocaleDateString('en-US', dayOnly)}`;
  }
  return `${start.toLocaleDateString('en-US', withMonth)} – ${end.toLocaleDateString('en-US', withMonth)}`;
}

export function guestsLabel(guests: number): string {
  return guests === 1 ? '1 guest' : `${guests} guests`;
}
