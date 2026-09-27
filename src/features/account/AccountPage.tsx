'use client';

import { BookingsList } from '@/features/account/components/BookingsList';
import { ProfileCard } from '@/features/account/components/ProfileCard';
import { useAllBookings } from '@/features/account/hooks/useAllBookings';
import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { AppPage, PageHero, SectionHeader } from '@/shared/components';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AccountPage() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useIsAuthenticated();
  const { data: bookings = [] } = useAllBookings();

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
    <AppPage footer={false} mainMaxW="900px" mainPt={{ base: 6, md: '44px' }}>
      <PageHero
        title="Your account"
        description="Manage your profile and review all your bookings."
        size="app"
        mb={{ base: 6, md: 8 }}
        maxW="none"
      />

      <SectionHeader title="Profile" mt={0} mb="14px" />
      <ProfileCard user={user} />

      <SectionHeader
        title="All bookings"
        subtitle={`${bookings.length} booking${bookings.length === 1 ? '' : 's'}`}
        mt={{ base: 8, md: 10 }}
        mb="14px"
      />

      <BookingsList bookings={bookings} />
    </AppPage>
  );
}
