import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { mockAuthUser } from '@/features/auth/types';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useAuthStore', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.setState({ user: null });
    });
    localStorage.clear();
  });

  it('starts logged out', () => {
    expect(useAuthStore.getState().user).toBeNull();
    const { result } = renderHook(() => useIsAuthenticated());
    expect(result.current).toBe(false);
  });

  it('logs in with the provided email', () => {
    act(() => {
      useAuthStore.getState().login('guest@example.com');
    });

    const user = useAuthStore.getState().user;
    expect(user?.email).toBe('guest@example.com');
    expect(user?.firstName).toBe(mockAuthUser.firstName);

    const { result } = renderHook(() => useIsAuthenticated());
    expect(result.current).toBe(true);
  });

  it('falls back to the mock email when blank', () => {
    act(() => {
      useAuthStore.getState().login('');
    });
    expect(useAuthStore.getState().user?.email).toBe(mockAuthUser.email);
  });

  it('clears the session on logout', () => {
    act(() => {
      useAuthStore.getState().login('guest@example.com');
      useAuthStore.getState().logout();
    });
    expect(useAuthStore.getState().user).toBeNull();
  });
});
