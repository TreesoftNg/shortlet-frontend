import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  mockAuthUser,
  type AuthMode,
  type AuthUser,
} from '@/features/auth/types';

type AuthState = {
  user: AuthUser | null;
  mode: AuthMode;
  isAuthenticated: boolean;
  setMode: (mode: AuthMode) => void;
  login: (email: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      mode: 'signin',
      isAuthenticated: false,
      setMode: (mode) => set({ mode }),
      login: (email) =>
        set({
          user: { ...mockAuthUser, email: email || mockAuthUser.email },
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'haven-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
