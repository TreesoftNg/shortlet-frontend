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
