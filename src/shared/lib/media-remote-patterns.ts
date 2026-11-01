import type { RemotePattern } from 'next/dist/shared/lib/image-config';

/** Production photo storage (the API's MEDIA_PUBLIC_BASE_URL). */
export const DEFAULT_MEDIA_BASE_URL =
  'https://sunmade-s3.s3.us-east-1.amazonaws.com';

/**
 * Lets next/image load unit and property photos from where the API stores
 * them (S3 now, a CDN later). Only the `tenants/` folder is allowed; pending
 * uploads stay out. Env may be blank or wrapped in quotes on Vercel.
 */
export function mediaRemotePatterns(raw: string | undefined): RemotePattern[] {
  const value = (raw ?? '').trim().replace(/^["']|["']$/g, '');
  let url: URL;
  try {
    url = new URL(value || DEFAULT_MEDIA_BASE_URL);
  } catch {
    url = new URL(DEFAULT_MEDIA_BASE_URL);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    url = new URL(DEFAULT_MEDIA_BASE_URL);
  }
  const basePath = url.pathname.replace(/\/+$/, '');
  return [
    {
      protocol: url.protocol === 'http:' ? 'http' : 'https',
      hostname: url.hostname,
      port: url.port,
      pathname: `${basePath}/tenants/**`,
    },
  ];
}
