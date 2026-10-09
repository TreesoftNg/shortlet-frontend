/**
 * Browser talks to `/backend/*` on this app. Next rewrites that prefix to
 * `NEXT_PUBLIC_API_BASE_URL` (default local API) so we skip CORS.
 *
 * Docs: http://localhost:4000/api/docs
 */
export const API_PROXY_PREFIX = '/backend';

export const DEFAULT_API_ORIGIN = 'http://localhost:4000';

export const DEFAULT_TENANT_SLUG = 'sunmade';

export function getTenantSlug(): string {
  return process.env.NEXT_PUBLIC_TENANT_SLUG ?? DEFAULT_TENANT_SLUG;
}
