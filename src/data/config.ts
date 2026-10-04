/**
 * Browser talks to `/backend/*` on this app. Next rewrites that prefix to
 * the staging API so we skip CORS (staging only allows sunmadeapartments.com).
 *
 * Docs: https://api-staging.sunmadeapartments.com/api/docs#/Customers
 */
export const API_PROXY_PREFIX = '/backend';

export const DEFAULT_API_ORIGIN =
  'https://api-staging.sunmadeapartments.com';

export const DEFAULT_TENANT_SLUG = 'sunmade';

export function getTenantSlug(): string {
  return process.env.NEXT_PUBLIC_TENANT_SLUG ?? DEFAULT_TENANT_SLUG;
}
