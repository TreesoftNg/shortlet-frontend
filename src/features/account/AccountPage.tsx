'use client';

import { BookingsList } from '@/features/account/components/BookingsList';
import { ProfileCard } from '@/features/account/components/ProfileCard';
import { useAllBookings } from '@/features/account/hooks/useAllBookings';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { SiteHeader } from '@/shared/components/SiteHeader';
import { pagePx } from '@/shared/layout';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AccountPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);
  const { data: bookings = [] } = useAllBookings();

  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated || !user) {
    return (
      <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
        <SiteHeader />
        <Box px={pagePx} py={10}>
          <Text color="ink.2">Loading your account…</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <SiteHeader />

      <Box
        as="main"
        px={pagePx}
        pb={{ base: '100px', md: '80px' }}
        maxW="900px"
      >
        <Heading
          as="h1"
          mt={{ base: 6, md: '44px' }}
          fontSize={{ base: '28px', md: '34px' }}
          fontWeight="800"
          letterSpacing="-0.02em"
        >
          Your account
        </Heading>
        <Text color="ink.2" fontSize="15px" mt="6px" mb={{ base: 6, md: 8 }}>
          Manage your profile and review all your Sunmade bookings.
        </Text>

        <Text
          as="h2"
          fontSize="18px"
          fontWeight="700"
          mb="14px"
          letterSpacing="-0.01em"
        >
          Profile
        </Text>
        <ProfileCard user={user} />

        <Flex
          justify="space-between"
          align="end"
          mt={{ base: 8, md: 10 }}
          mb="14px"
          gap={3}
        >
          <Box>
            <Text
              as="h2"
              fontSize="18px"
              fontWeight="700"
              letterSpacing="-0.01em"
            >
              All bookings
            </Text>
            <Text color="ink.2" fontSize="14px" mt="4px">
              {bookings.length} booking{bookings.length === 1 ? '' : 's'}
            </Text>
          </Box>
          <Text
            asChild
            fontWeight="700"
            fontSize="14px"
            textDecoration="underline"
          >
            <Link href="/trips">Open trips</Link>
          </Text>
        </Flex>

        <BookingsList bookings={bookings} />
      </Box>

      <MobileTabBar />
    </Box>
  );
}
