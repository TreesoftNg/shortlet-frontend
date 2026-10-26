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

function readJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2 || !parts[1]) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as unknown;
    if (typeof payload !== 'object' || payload === null) return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Returns JWT `exp` as epoch milliseconds, or null if missing/unreadable. */
export function getJwtExpiryMs(token: string): number | null {
  const payload = readJwtPayload(token);
  return typeof payload?.exp === 'number' ? payload.exp * 1000 : null;
}

/** Returns JWT `sub` (user id) when present. */
export function getJwtSubject(token: string): string | null {
  const payload = readJwtPayload(token);
  return typeof payload?.sub === 'string' && payload.sub.trim()
    ? payload.sub.trim()
    : null;
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
