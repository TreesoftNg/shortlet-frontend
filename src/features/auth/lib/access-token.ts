/**
 * Client-side JWT expiry helpers. Signature is not verified here —
 * the API still validates the token; we only avoid sending clearly expired ones.
 */

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  const withPad = padded + '='.repeat(padLength);
  if (typeof atob === 'function') return atob(withPad);
  return Buffer.from(withPad, 'base64').toString('utf8');
}

/** Returns JWT `exp` as epoch milliseconds, or null if missing/unreadable. */
export function getJwtExpiryMs(token: string): number | null {
  const parts = token.split('.');
  if (parts.length < 2 || !parts[1]) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as {
      exp?: unknown;
    };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(
  token: string | null | undefined,
  expiresAtIso?: string | null,
  skewMs = 30_000,
): boolean {
  if (!token) return true;

  if (expiresAtIso) {
    const expiresAt = Date.parse(expiresAtIso);
    if (Number.isFinite(expiresAt)) {
      return Date.now() >= expiresAt - skewMs;
    }
  }

  const jwtExp = getJwtExpiryMs(token);
  if (jwtExp != null) {
    return Date.now() >= jwtExp - skewMs;
  }

  return false;
}
