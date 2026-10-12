import { refreshCustomerSession } from '@/data/api/customers';
import { ApiError } from '@/data/api/http';
import { isAccessTokenExpired } from '@/features/auth/lib/access-token';
import { useAuthStore } from '@/features/auth/store/auth-store';

const REFRESH_LOCK_NAME = 'sunmade-guest-token-refresh';
const EXPIRY_MARGIN_MS = 30_000;

let refreshInFlight: Promise<string | null> | null = null;

/**
 * Returns a usable guest access token, refreshing via the API when the
 * current one is expired or about to expire. Concurrent callers share one
 * refresh (and tabs take turns) because refresh tokens rotate.
 */
export async function ensureAccessToken(): Promise<string | null> {
  const { accessToken, accessTokenExpiresAt, refreshToken } =
    useAuthStore.getState();

  if (
    accessToken &&
    !isAccessTokenExpired(accessToken, accessTokenExpiresAt, EXPIRY_MARGIN_MS)
  ) {
    return accessToken;
  }

  if (!refreshToken) {
    if (accessToken || useAuthStore.getState().user) {
      useAuthStore.getState().logout();
    }
    return null;
  }

  return refreshAccessToken();
}

export function refreshAccessToken(): Promise<string | null> {
  refreshInFlight ??= withRefreshLock(runRefresh).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function runRefresh(): Promise<string | null> {
  try {
    await useAuthStore.persist.rehydrate();
  } catch {
    // Persist may be unavailable in tests.
  }

  const state = useAuthStore.getState();
  const refreshToken = state.refreshToken;
  if (!refreshToken) {
    state.logout();
    return null;
  }

  try {
    const tokens = await refreshCustomerSession({ refreshToken });
    const user = useAuthStore.getState().user;
    if (!tokens?.accessToken || !user) {
      useAuthStore.getState().logout();
      return null;
    }
    useAuthStore.getState().setSession({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? refreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt ?? null,
    });
    return tokens.accessToken;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      useAuthStore.getState().logout();
      return null;
    }
    // Network blip: keep the session so the caller can retry.
    throw error;
  }
}

async function withRefreshLock<T>(work: () => Promise<T>): Promise<T> {
  const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
  return locks ? locks.request(REFRESH_LOCK_NAME, work) : work();
}
