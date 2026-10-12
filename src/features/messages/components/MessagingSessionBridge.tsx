'use client';

import { useIsAuthenticated } from '@/features/auth/store/auth-store';
import { useMessagingSocket } from '@/features/messages/hooks/useMessagingSocket';

/** Keeps the customer messaging socket alive while signed in (unread badges). */
export function MessagingSessionBridge() {
  const isAuthenticated = useIsAuthenticated();
  useMessagingSocket({ enabled: isAuthenticated });
  return null;
}
