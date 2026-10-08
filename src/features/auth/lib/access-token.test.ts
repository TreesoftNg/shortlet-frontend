import {
  getJwtExpiryMs,
  isAccessTokenExpired,
} from '@/features/auth/lib/access-token';
import { describe, expect, it } from 'vitest';

function jwtWithExp(expSeconds: number): string {
  const header = Buffer.from(
    JSON.stringify({ alg: 'none', typ: 'JWT' }),
  ).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp: expSeconds })).toString(
    'base64url',
  );
  return `${header}.${payload}.sig`;
}

describe('access token expiry', () => {
  it('reads exp from a JWT', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    expect(getJwtExpiryMs(jwtWithExp(exp))).toBe(exp * 1000);
  });

  it('treats past JWT exp as expired', () => {
    const exp = Math.floor(Date.now() / 1000) - 60;
    expect(isAccessTokenExpired(jwtWithExp(exp))).toBe(true);
  });

  it('uses accessTokenExpiresAt when provided', () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    const future = new Date(Date.now() + 60_000).toISOString();
    expect(isAccessTokenExpired('not-a-jwt', past)).toBe(true);
    expect(isAccessTokenExpired('not-a-jwt', future)).toBe(false);
  });

  it('treats missing token as expired', () => {
    expect(isAccessTokenExpired(null)).toBe(true);
  });
});
