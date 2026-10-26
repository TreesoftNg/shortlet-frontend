import { ApiError } from '@/data/api/http';
import { quoteErrorMessage } from '@/data/lib/quote-error';
import { describe, expect, it } from 'vitest';

const FALLBACK = 'Couldn’t load the live price for these dates.';

function validationError(fields: Record<string, string[]>) {
  return new ApiError({
    status: 400,
    code: 'VALIDATION_ERROR',
    message: 'The request contains invalid data',
    details: { fields },
  });
}

describe('quoteErrorMessage', () => {
  it('prefers the check-out field message over the generic message', () => {
    expect(
      quoteErrorMessage(
        validationError({
          checkOut: ['This unit needs a stay of at least 3 nights'],
        }),
        FALLBACK,
      ),
    ).toBe('This unit needs a stay of at least 3 nights');
  });

  it('checks check-out, then check-in, then adults', () => {
    expect(
      quoteErrorMessage(
        validationError({
          adults: ['Too many guests'],
          checkIn: ['Check-in must be today or later'],
          checkOut: ['This unit can be booked for at most 10 nights'],
        }),
        FALLBACK,
      ),
    ).toBe('This unit can be booked for at most 10 nights');
    expect(
      quoteErrorMessage(
        validationError({
          adults: ['Too many guests'],
          checkIn: ['Check-in must be today or later'],
        }),
        FALLBACK,
      ),
    ).toBe('Check-in must be today or later');
    expect(
      quoteErrorMessage(validationError({ adults: ['Too many guests'] }), FALLBACK),
    ).toBe('Too many guests');
  });

  it('falls back to the API message when no quote field is named', () => {
    expect(
      quoteErrorMessage(validationError({ unitId: ['Unknown unit'] }), FALLBACK),
    ).toBe('The request contains invalid data');
  });

  it('uses the fallback for errors that did not come from the API', () => {
    expect(quoteErrorMessage(new TypeError('Failed to fetch'), FALLBACK)).toBe(
      FALLBACK,
    );
    expect(quoteErrorMessage(null, FALLBACK)).toBe(FALLBACK);
  });
});
