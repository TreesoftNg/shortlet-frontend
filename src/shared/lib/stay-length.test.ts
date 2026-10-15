import type { StayLimits } from '@/data/types';
import {
  DEFAULT_STAY_LIMITS,
  earliestCheckOut,
  fitCheckOutToLimits,
  latestCheckOut,
  stayLengthProblem,
  stayLimitsHint,
} from '@/shared/lib/stay-length';
import { describe, expect, it } from 'vitest';

const threeToTen: StayLimits = { min_nights: 3, max_nights: 10 };

describe('earliestCheckOut', () => {
  it('adds the minimum nights to check-in', () => {
    expect(earliestCheckOut('2026-10-12', threeToTen)).toBe('2026-10-15');
  });

  it('allows a single night by default', () => {
    expect(earliestCheckOut('2026-10-12', DEFAULT_STAY_LIMITS)).toBe(
      '2026-10-13',
    );
  });

  it('crosses month and year boundaries', () => {
    expect(earliestCheckOut('2026-12-30', threeToTen)).toBe('2027-01-02');
  });
});

describe('latestCheckOut', () => {
  it('adds the maximum nights to check-in', () => {
    expect(latestCheckOut('2026-10-12', threeToTen)).toBe('2026-10-22');
  });

  it('has no latest check-out without a maximum', () => {
    expect(latestCheckOut('2026-10-12', DEFAULT_STAY_LIMITS)).toBeNull();
  });
});

describe('fitCheckOutToLimits', () => {
  it('keeps a check-out that already fits', () => {
    expect(fitCheckOutToLimits('2026-10-12', '2026-10-16', threeToTen)).toBe(
      '2026-10-16',
    );
  });

  it('moves check-out forward when the stay is too short', () => {
    expect(fitCheckOutToLimits('2026-10-12', '2026-10-13', threeToTen)).toBe(
      '2026-10-15',
    );
  });

  it('moves check-out forward when it is not after check-in', () => {
    expect(
      fitCheckOutToLimits('2026-10-12', '2026-10-10', DEFAULT_STAY_LIMITS),
    ).toBe('2026-10-13');
  });

  it('moves check-out back when the stay is too long', () => {
    expect(fitCheckOutToLimits('2026-10-12', '2026-11-01', threeToTen)).toBe(
      '2026-10-22',
    );
  });
});

describe('stayLengthProblem', () => {
  it('accepts stays inside the limits', () => {
    expect(stayLengthProblem('2026-10-12', '2026-10-15', threeToTen)).toBeNull();
    expect(stayLengthProblem('2026-10-12', '2026-10-22', threeToTen)).toBeNull();
  });

  it('explains a stay that is too short', () => {
    expect(stayLengthProblem('2026-10-12', '2026-10-14', threeToTen)).toBe(
      'Minimum stay is 3 nights',
    );
  });

  it('explains a stay that is too long', () => {
    expect(stayLengthProblem('2026-10-12', '2026-10-23', threeToTen)).toBe(
      'Maximum stay is 10 nights',
    );
  });

  it('uses the singular for one night', () => {
    expect(
      stayLengthProblem('2026-10-12', '2026-10-12', DEFAULT_STAY_LIMITS),
    ).toBe('Minimum stay is 1 night');
    expect(
      stayLengthProblem('2026-10-12', '2026-10-14', {
        min_nights: 1,
        max_nights: 1,
      }),
    ).toBe('Maximum stay is 1 night');
  });

  it('allows any stay of one night or more by default', () => {
    expect(
      stayLengthProblem('2026-10-12', '2027-10-12', DEFAULT_STAY_LIMITS),
    ).toBeNull();
  });
});

describe('stayLimitsHint', () => {
  it('describes both limits', () => {
    expect(stayLimitsHint(threeToTen)).toBe(
      'Minimum stay: 3 nights · Maximum stay: 10 nights',
    );
  });

  it('describes a single limit', () => {
    expect(stayLimitsHint({ min_nights: 2, max_nights: null })).toBe(
      'Minimum stay: 2 nights',
    );
    expect(stayLimitsHint({ min_nights: 1, max_nights: 1 })).toBe(
      'Maximum stay: 1 night',
    );
  });

  it('has nothing to say when any stay is allowed', () => {
    expect(stayLimitsHint(DEFAULT_STAY_LIMITS)).toBeNull();
  });
});
