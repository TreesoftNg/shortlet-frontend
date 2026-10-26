'use client';

import { ensureAccessToken } from '@/features/auth/lib/refresh-session';
import { isAccessTokenExpired } from '@/features/auth/lib/access-token';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useEffect, useState } from 'react';

/**
 * Live access token for React Query. Triggers a refresh when the stored
 * token is missing/expired but a refresh token remains.
 */
export function useValidAccessToken(): string | null {
  const accessToken = useAuthStore((s) => s.accessToken);
  const accessTokenExpiresAt = useAuthStore((s) => s.accessTokenExpiresAt);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const [token, setToken] = useState<string | null>(() => {
    if (
      accessToken &&
      !isAccessTokenExpired(accessToken, accessTokenExpiresAt)
    ) {
      return accessToken;
    }
    return null;
  });

  useEffect(() => {
    let cancelled = false;

    if (
      accessToken &&
      !isAccessTokenExpired(accessToken, accessTokenExpiresAt)
    ) {
      setToken(accessToken);
      return;
    }

    if (!refreshToken) {
      setToken(null);
      return;
    }

    void ensureAccessToken()
      .then((next) => {
        if (!cancelled) setToken(next);
      })
      .catch(() => {
        if (!cancelled) setToken(null);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, accessTokenExpiresAt, refreshToken]);

  return token;
}
