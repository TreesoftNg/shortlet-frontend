'use client';

import {
  purgeExpiredAuthSession,
  useAuthStore,
} from '@/features/auth/store/auth-store';
import { useEffect, useState } from 'react';

/** Wait for persisted auth to rehydrate before redirecting. */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finish = () => {
      purgeExpiredAuthSession();
      setHydrated(true);
    };

    if (useAuthStore.persist.hasHydrated()) {
      finish();
      return;
    }

    return useAuthStore.persist.onFinishHydration(finish);
  }, []);

  return hydrated;
}
