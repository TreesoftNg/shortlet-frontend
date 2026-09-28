import {
  badgeLabel,
  bedsGuestsLabel,
  bedsOnlyLabel,
  formatLocation,
  formatNaira,
  formatNairaShort,
  shortArea,
} from '@/shared/lib/format';
import { describe, expect, it } from 'vitest';

describe('formatNaira', () => {
  it('formats amounts with the naira symbol', () => {
    expect(formatNaira(1000)).toContain('₦');
    expect(formatNaira(1000)).toContain('1');
  });
});

describe('formatNairaShort', () => {
  it('compacts thousands to k', () => {
    expect(formatNairaShort(85000)).toBe('₦85k');
  });

  it('falls back to full format under 1000', () => {
    expect(formatNairaShort(500)).toBe(formatNaira(500));
  });
});

describe('formatLocation', () => {
  it('strips trailing country code', () => {
    expect(formatLocation('Lekki Phase 1, Lagos, NG')).toBe(
      'Lekki Phase 1, Lagos',
    );
  });
});

describe('shortArea', () => {
  it('returns the first segment', () => {
    expect(shortArea('Lekki Phase 1, Lagos, NG')).toBe('Lekki Phase 1');
  });
});

describe('badgeLabel', () => {
  it('maps known badges', () => {
    expect(badgeLabel('guest_favourite')).toBe('Guest favourite');
    expect(badgeLabel('new')).toBe('New');
    expect(badgeLabel('only_1_left')).toBe('Only 1 left');
  });
});

describe('bedsGuestsLabel', () => {
  it('handles singular and plural', () => {
    expect(bedsGuestsLabel(1, 1)).toBe('1 bed · 1 guest');
    expect(bedsGuestsLabel(2, 4)).toBe('2 beds · 4 guests');
  });

  it('treats null as zero', () => {
    expect(bedsGuestsLabel(null, null)).toBe('0 beds · 0 guests');
  });
});

describe('bedsOnlyLabel', () => {
  it('formats bed counts', () => {
    expect(bedsOnlyLabel(1)).toBe('1 bed');
    expect(bedsOnlyLabel(3)).toBe('3 beds');
  });
});
