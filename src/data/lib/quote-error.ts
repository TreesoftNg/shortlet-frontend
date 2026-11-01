import { ApiError, apiFieldErrors } from '@/data/api/http';

/** Quote query params whose validation messages are worth showing to guests. */
const QUOTE_FIELDS = ['checkOut', 'checkIn', 'adults'] as const;

/**
 * Guest-facing message for a failed stay quote. Prefers the field-level
 * validation message (e.g. "This unit needs a stay of at least 3 nights")
 * over the generic top-level API message.
 */
export function quoteErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback;
  const fields = apiFieldErrors(error);
  for (const field of QUOTE_FIELDS) {
    const message = fields[field]?.[0];
    if (message) return message;
  }
  return error.message || fallback;
}
