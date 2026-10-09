import {
  invalidateAuthSession,
  purgeExpiredAuthSession,
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { sampleAuthUser } from '@/features/auth/types';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

function jwtWithExp(expSeconds: number): string {
  const header = Buffer.from(
    JSON.stringify({ alg: 'none', typ: 'JWT' }),
  ).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp: expSeconds })).toString(
    'base64url',
  );
  return `${header}.${payload}.sig`;
}

const session = {
  user: { ...sampleAuthUser, email: 'guest@example.com' },
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  accessTokenExpiresAt: new Date(Date.now() + 60_000).toISOString(),
};

describe('useAuthStore', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.getState().logout();
    });
    localStorage.clear();
  });

  it('starts logged out', () => {
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
    const { result } = renderHook(() => useIsAuthenticated());
    expect(result.current).toBe(false);
  });

  it('stores the session from the customer API', () => {
    act(() => {
      useAuthStore.getState().setSession(session);
    });

    expect(useAuthStore.getState().user?.email).toBe('guest@example.com');
    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(useAuthStore.getState().accessTokenExpiresAt).toBe(
      session.accessTokenExpiresAt,
    );

    const { result } = renderHook(() => useIsAuthenticated());
    expect(result.current).toBe(true);
  });

  it('clears the session on logout', () => {
    act(() => {
      useAuthStore.getState().setSession(session);
      useAuthStore.getState().logout();
    });
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('treats an expired JWT as logged out and clears it', () => {
    const expired = jwtWithExp(Math.floor(Date.now() / 1000) - 120);
    act(() => {
      useAuthStore.getState().setSession({
        ...session,
        accessToken: expired,
        accessTokenExpiresAt: null,
      });
    });

    expect(useAuthStore.getState().getValidAccessToken()).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();

    const { result } = renderHook(() => useIsAuthenticated());
    expect(result.current).toBe(false);
  });

  it('purgeExpiredAuthSession drops a dead persisted token', () => {
    const expired = jwtWithExp(Math.floor(Date.now() / 1000) - 120);
    act(() => {
      useAuthStore.getState().setSession({
        ...session,
        accessToken: expired,
        accessTokenExpiresAt: null,
      });
      purgeExpiredAuthSession();
    });
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('invalidateAuthSession logs the user out', () => {
    act(() => {
      useAuthStore.getState().setSession(session);
      invalidateAuthSession();
    });
    expect(useAuthStore.getState().user).toBeNull();
  });
});
