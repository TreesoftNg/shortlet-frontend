/**
 * Shared API client helpers.
 *
 * Today every endpoint is mocked with a short delay so React Query loading /
 * caching behaviour matches a real network. When we wire Nest, replace
 * `request()` with `fetch` / an HTTP client — keep the same function names in
 * `src/data/api/*` so feature hooks do not change.
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
