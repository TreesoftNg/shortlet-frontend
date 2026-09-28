'use client';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { useEffect, useState } from 'react';

/** Wait for persisted auth to rehydrate before redirecting. */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
