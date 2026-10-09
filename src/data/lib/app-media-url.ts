import { getApiBaseUrl } from '@/data/config';

/**
 * Normalise API media paths onto `NEXT_PUBLIC_API_BASE_URL` so
 * `next/image` can load them from the real API host.
 */
export function toAppMediaUrl(url: string | null | undefined): string {
  if (!url) return '';

  const base = getApiBaseUrl();

  if (url.startsWith(`${base}/`)) return url;

  // Legacy same-origin proxy paths from older builds.
  if (url.startsWith('/backend/')) {
    return `${base}${url.slice('/backend'.length)}`;
  }

  if (url.startsWith('/media/')) {
    return `${base}${url}`;
  }

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/media/')) {
      return `${base}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // leave non-URL strings alone
  }

  return url;
}
