/**
 * Browser talks to `/backend/*` on this app. Next rewrites that prefix to
 * `API_BASE_URL` (default staging) so we skip CORS.
 *
 * Docs: https://api-staging.sunmadeapartments.com/api/docs
 */
export const API_PROXY_PREFIX = '/backend';

export const DEFAULT_API_ORIGIN =
  'https://api-staging.sunmadeapartments.com';

export const DEFAULT_TENANT_SLUG = 'sunmade';

export function getTenantSlug(): string {
  return process.env.NEXT_PUBLIC_TENANT_SLUG ?? DEFAULT_TENANT_SLUG;
}
