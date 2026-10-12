'use client';

import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import { ensureAccessToken } from '@/features/auth/lib/refresh-session';
import { MessagingSessionBridge } from '@/features/messages/components/MessagingSessionBridge';
import { useEffect } from 'react';

/**
 * After Zustand rehydrates from localStorage, renew an expired access token
 * (or clear the session when refresh is impossible).
 */
export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (!hydrated) return;
    void ensureAccessToken().catch(() => {
      // Offline — keep the persisted session for a later retry.
    });
  }, [hydrated]);

  return (
    <>
      <MessagingSessionBridge />
      {children}
    </>
  );
}
