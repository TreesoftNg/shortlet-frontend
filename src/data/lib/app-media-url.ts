import { API_PROXY_PREFIX } from '@/data/config';

/**
 * Point absolute API media URLs at the Next `/backend` rewrite so
 * `next/image` loads same-origin (avoids broken localhost optimizer fetches).
 */
export function toAppMediaUrl(url: string | null | undefined): string {
  if (!url) return '';

  if (url.startsWith(`${API_PROXY_PREFIX}/`)) return url;

  if (url.startsWith('/media/')) {
    return `${API_PROXY_PREFIX}${url}`;
  }

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/media/')) {
      return `${API_PROXY_PREFIX}${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // leave non-URL strings alone
  }

  return url;
}
