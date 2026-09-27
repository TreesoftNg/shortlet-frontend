'use client';

/**
 * Auth session only.
 * Sign-in / sign-up form mode stays in AuthForm local state.
 * Profile / bookings come from React Query, not this store.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockAuthUser, type AuthUser } from '@/features/auth/types';

type AuthState = {
  user: AuthUser | null;
  login: (email: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email) =>
        set({
          user: { ...mockAuthUser, email: email || mockAuthUser.email },
        }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'sunmade-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export function useIsAuthenticated() {
  return useAuthStore((s) => s.user != null);
}
