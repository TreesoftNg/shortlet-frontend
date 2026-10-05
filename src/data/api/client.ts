/**
 * Shared API client helpers.
 *
 * Listings / bookings still use this mock wrapper. Customer auth uses `http.ts`.
 */

const DEFAULT_DELAY_MS = 200;

export function delay(ms = DEFAULT_DELAY_MS): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Wrap a sync mock result as an async API response. */
export async function request<T>(data: T, ms = DEFAULT_DELAY_MS): Promise<T> {
  await delay(ms);
  return data;
}
