'use client';

import { ProfileCard } from '@/features/account/components/ProfileCard';
import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { TripsPanel } from '@/features/trips/components/TripsPanel';
import {
  AppPage,
  PageHero,
  SectionHeader,
  Skeleton,
  SkeletonText,
} from '@/shared/components';
import { Box } from '@chakra-ui/react';
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
      <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
        <AccountPageSkeleton />
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

      <SectionHeader title="Trips" mt={{ base: 8, md: 10 }} mb="10px" />
      <TripsPanel embedded />
    </AppPage>
  );
}

function AccountPageSkeleton() {
  return (
    <Box aria-busy="true">
      <Skeleton h="36px" w="220px" mb={3} borderRadius="full" />
      <Skeleton h="16px" w="320px" mb={8} borderRadius="full" />
      <Skeleton h="18px" w="80px" mb="14px" borderRadius="full" />
      <Skeleton h="120px" borderRadius="lg" mb={10} />
      <Skeleton h="18px" w="70px" mb={4} borderRadius="full" />
      <Skeleton h="40px" w={{ base: '100%', md: '360px' }} borderRadius="full" mb={6} />
      <Skeleton h="220px" borderRadius="22px" mb={6} />
      <SkeletonText lines={2} />
    </Box>
  );
}
