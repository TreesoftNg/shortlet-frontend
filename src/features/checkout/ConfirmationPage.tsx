'use client';

import {
  useCheckoutProperty,
  useVerifyBookingPayment,
} from '@/features/checkout/hooks/useCheckoutData';
import { getBookingById } from '@/data/api/bookings';
import {
  getBookingAccessToken,
  getPendingBookingId,
  restoreBookingSessionFromParams,
} from '@/data/lib/booking-session';
import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import { isAccessTokenExpired } from '@/features/auth/lib/access-token';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { EmptyState, ErrorState, Skeleton, SkeletonText } from '@/shared/components';
import { formatNaira } from '@/shared/lib/format';
import { SunmadeLogo } from '@/shared/components/brand';
import type { Booking } from '@/data/types';
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { Check, CircleCheck, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authHydrated = useAuthHydrated();
  const bookingIdParam = searchParams.get('bookingId');
  const bookingTokenParam = searchParams.get('bookingToken');
  const transactionId =
    searchParams.get('transaction_id') ?? searchParams.get('transactionId');
  const slug = searchParams.get('property');
  const [bookingId, setBookingId] = useState(bookingIdParam);
  const accessToken = useAuthStore((s) => {
    if (!s.accessToken) return null;
    if (isAccessTokenExpired(s.accessToken, s.accessTokenExpiresAt)) {
      return null;
    }
    return s.accessToken;
  });
  const verifyPayment = useVerifyBookingPayment();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    data: property,
    isPending: propertyPending,
  } = useCheckoutProperty(slug);

  useEffect(() => {
    restoreBookingSessionFromParams({
      bookingId: bookingIdParam,
      bookingToken: bookingTokenParam,
    });

    // Drop token from the address bar after restoring session (Referer hygiene).
    if (bookingTokenParam && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('bookingToken')) {
        url.searchParams.delete('bookingToken');
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      }
    }

    if (bookingIdParam) {
      setBookingId(bookingIdParam);
      return;
    }
    // Hosted Flutterwave return URL may omit bookingId — recover from session.
    const pending = getPendingBookingId();
    if (pending) setBookingId(pending);
    else setLoading(false);
  }, [bookingIdParam, bookingTokenParam]);

  useEffect(() => {
    if (!bookingId || !authHydrated) return;

    let cancelled = false;
    const bookingToken =
      bookingTokenParam?.trim() || getBookingAccessToken(bookingId);

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        if (transactionId) {
          const verified = await verifyPayment.mutateAsync({
            bookingId: bookingId!,
            transactionId,
            bookingToken,
          });
          if (!cancelled) setBooking(verified);
        } else {
          const loaded = await getBookingById(
            bookingId!,
            accessToken,
            bookingToken,
          );
          if (!cancelled) setBooking(loaded);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'Could not load booking.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per booking/tx/auth
  }, [bookingId, bookingTokenParam, transactionId, accessToken, authHydrated]);

  if (!bookingId && !slug) {
    return (
      <Box p={10} bg="bg.soft" minH="100vh">
        <Box maxW="640px" mx="auto">
          <EmptyState
            title="No booking to show"
            description="Complete a reservation to see your confirmation here."
            actionLabel="Go home"
            actionHref="/"
            mt={0}
          />
        </Box>
      </Box>
    );
  }

  if (loading || !authHydrated || (slug && propertyPending && !booking)) {
    return (
      <Box p={10} bg="bg.soft" minH="100vh" aria-busy="true">
        <Box maxW="720px" mx="auto">
          <Skeleton h="48px" w="48px" borderRadius="full" mb={6} />
          <Skeleton h="32px" w="280px" mb={3} borderRadius="full" />
          <SkeletonText lines={2} lastWidth="50%" />
          <Skeleton h="200px" mt={8} borderRadius="22px" />
        </Box>
      </Box>
    );
  }

  if (loadError || (!booking && !property)) {
    return (
      <Box p={10} bg="bg.soft" minH="100vh">
        <Box maxW="640px" mx="auto">
          <ErrorState
            title="Booking not found"
            description={
              loadError ||
              'We couldn’t load this confirmation. The link may be incomplete.'
            }
            actionLabel="Go home"
            actionHref="/"
            mt={0}
          />
        </Box>
      </Box>
    );
  }

  const name = booking?.property_name || property?.public_name || 'Your stay';
  const image = booking?.property_image || property?.picture || '';
  const dates = booking?.dates_range_label || '';
  const total = booking?.amount_paid;
  const reference = booking?.reference;
  const status = booking?.status ?? 'pending';

  return (
    <Box bg="bg.soft" minH="100vh" pb={10}>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 10 }}
        py={4}
        bg="white"
        borderBottom="1px solid"
        borderColor="line"
      >
        <Link href="/">
          <SunmadeLogo />
        </Link>
        <Flex gap={3}>
          <Button variant="ghost" size="sm" onClick={() => router.push('/trips')}>
            <Menu size={18} />
            Trips
          </Button>
        </Flex>
      </Flex>

      <Box maxW="720px" mx="auto" px={{ base: 4, md: 0 }} pt={{ base: 8, md: 12 }}>
        <Flex
          w="56px"
          h="56px"
          borderRadius="full"
          bg="ok"
          color="white"
          align="center"
          justify="center"
          mb={5}
        >
          <CircleCheck size={28} strokeWidth={1.8} />
        </Flex>

        <Heading
          as="h1"
          fontSize={{ base: '28px', md: '34px' }}
          fontWeight="800"
          letterSpacing="-0.02em"
        >
          {status === 'confirmed' ? 'You’re booked!' : 'Booking received'}
        </Heading>
        <Text color="ink.2" mt={2} fontSize="16px">
          {status === 'confirmed'
            ? 'Payment confirmed. A receipt is on its way to your email.'
            : 'We’re confirming your payment. This page will update shortly.'}
        </Text>

        <Box
          mt={8}
          bg="white"
          borderRadius="22px"
          border="1px solid"
          borderColor="line"
          overflow="hidden"
        >
          {image ? (
            <Box position="relative" h="200px">
              <Image src={image} alt={name} fill style={{ objectFit: 'cover' }} />
            </Box>
          ) : null}
          <Box p={{ base: 5, md: 6 }}>
            <Text fontWeight="800" fontSize="20px">
              {name}
            </Text>
            {dates ? (
              <Text color="ink.2" mt={1}>
                {dates}
                {booking?.guests
                  ? ` · ${booking.guests} guest${booking.guests === 1 ? '' : 's'}`
                  : ''}
              </Text>
            ) : null}
            {reference ? (
              <Text color="ink.3" fontSize="14px" mt={3}>
                Reference {reference}
              </Text>
            ) : null}
            {total != null ? (
              <Text fontWeight="700" mt={4} fontSize="18px">
                {formatNaira(total)}
              </Text>
            ) : null}

            <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap={3} mt={6}>
              <Button
                variant="outline"
                onClick={() => router.push(bookingId ? `/trips` : '/')}
              >
                <Check size={16} />
                View trips
              </Button>
              <Button
                bg="brand.500"
                color="white"
                _hover={{ bg: 'brand.600' }}
                onClick={() => router.push('/search?tab=all')}
              >
                Browse more stays
              </Button>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
