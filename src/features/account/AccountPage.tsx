'use client';

import { ProfileCard } from '@/features/account/components/ProfileCard';
import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { TripsPanel } from '@/features/trips/components/TripsPanel';
import { AppPage, PageHero, SectionHeader } from '@/shared/components';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AccountPage() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated || !user) {
    return (
      <AppPage footer={false} mainPt={10}>
        <Text color="ink.2">Loading your account…</Text>
      </AppPage>
    );
  }

  return (
    <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
      <PageHero
        title="Your account"
        description="Manage your profile and review your trips."
        size="app"
        mb={{ base: 6, md: 8 }}
        maxW="none"
      />

      <SectionHeader title="Profile" mt={0} mb="14px" />
      <ProfileCard user={user} />

      <SectionHeader title="Trips" mt={{ base: 8, md: 10 }} mb={0} />
      <TripsPanel />
    </AppPage>
  );
}
