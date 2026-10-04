import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { sampleAuthUser } from '@/features/auth/types';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

const session = {
  user: { ...sampleAuthUser, email: 'guest@example.com' },
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
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
});
