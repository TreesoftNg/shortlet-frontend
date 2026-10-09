'use client';

import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import { purgeExpiredAuthSession } from '@/features/auth/store/auth-store';
import { useEffect } from 'react';

/**
 * After Zustand rehydrates from localStorage, drop expired sessions so the UI
 * never keeps showing a signed-in user without a usable token.
 */
export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (!hydrated) return;
    purgeExpiredAuthSession();
  }, [hydrated]);

  return children;
}
