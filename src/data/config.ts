/**
 * Browser calls the API origin from `NEXT_PUBLIC_API_BASE_URL` directly.
 *
 * Docs: https://api-staging.sunmadeapartments.com/api/docs
 */

/** Fallback when the env var is missing (local/tests). Prefer setting the env. */
export const DEFAULT_API_ORIGIN =
  'https://api-staging.sunmadeapartments.com';

export const DEFAULT_TENANT_SLUG = 'sunmade';

function normaliseOrigin(value: string | undefined | null): string | null {
  const raw = (value ?? '')
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\/$/, '');

  if (!raw) return null;
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) return null;
  return raw;
}

/** Staging/production API origin — always from env when set. */
export function getApiBaseUrl(): string {
  return (
    normaliseOrigin(process.env.NEXT_PUBLIC_API_BASE_URL) ??
    DEFAULT_API_ORIGIN
  );
}

export function getTenantSlug(): string {
  const slug = (process.env.NEXT_PUBLIC_TENANT_SLUG ?? '').trim();
  return slug || DEFAULT_TENANT_SLUG;
}
