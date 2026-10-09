'use client';

/**
 * Auth session only (user + tokens).
 * Profile / bookings still come from React Query once those APIs exist.
 */

import { clearBookingSession } from '@/data/lib/booking-session';
import { isAccessTokenExpired } from '@/features/auth/lib/access-token';
import { getQueryClient } from '@/shared/providers/query-provider';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/features/auth/types';

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  setSession: (session: AuthSession) => void;
  logout: () => void;
  /** Returns a usable access token, or null after clearing an expired session. */
  getValidAccessToken: () => string | null;
};

const emptySession = {
  user: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
} as const;

function clearPersistedAuth() {
  try {
    useAuthStore.persist.clearStorage();
  } catch {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('sunmade-auth');
    }
  }
}

/** Drop React Query + guest booking session leftovers after auth ends. */
function clearClientCaches() {
  clearBookingSession();
  try {
    getQueryClient().clear();
  } catch {
    // Query client may be unavailable during early SSR/tests.
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...emptySession,
      setSession: (session) =>
        set({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          accessTokenExpiresAt: session.accessTokenExpiresAt ?? null,
        }),
      logout: () => {
        set({ ...emptySession });
        clearPersistedAuth();
        clearClientCaches();
      },
      getValidAccessToken: () => {
        const { accessToken, accessTokenExpiresAt } = get();
        if (!accessToken) return null;
        if (isAccessTokenExpired(accessToken, accessTokenExpiresAt)) {
          get().logout();
          return null;
        }
        return accessToken;
      },
    }),
    {
      name: 'sunmade-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.accessToken) return;
        if (
          isAccessTokenExpired(state.accessToken, state.accessTokenExpiresAt)
        ) {
          // Defer so rehydrate finishes before we wipe storage.
          queueMicrotask(() => {
            useAuthStore.getState().logout();
          });
        }
      },
    },
  ),
);

/** Clears a dead session left in localStorage after API/token expiry. */
export function purgeExpiredAuthSession() {
  const state = useAuthStore.getState();
  if (!state.accessToken) {
    if (state.user) state.logout();
    return;
  }
  if (isAccessTokenExpired(state.accessToken, state.accessTokenExpiresAt)) {
    state.logout();
  }
}

export function useIsAuthenticated() {
  return useAuthStore((s) => {
    if (s.user == null || !s.accessToken) return false;
    return !isAccessTokenExpired(s.accessToken, s.accessTokenExpiresAt);
  });
}

/** Ends the local session after the API rejects the access token. */
export function invalidateAuthSession() {
  useAuthStore.getState().logout();
}

export function isAuthApiError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const record = error as { status?: unknown; code?: unknown };
  return (
    record.status === 401 ||
    record.code === 'INVALID_TOKEN' ||
    record.code === 'AUTHENTICATION_REQUIRED'
  );
}
