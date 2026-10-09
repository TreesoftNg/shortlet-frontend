'use client';

import {
  useBooking,
  useCancelBooking,
  useStartBookingPayment,
} from '@/data/hooks';
import { canCancelBooking, canPayBooking } from '@/data/lib/map-booking';
import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import {
  isAuthApiError,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import {
  AppButton,
  AppPage,
  EmptyState,
  ErrorState,
  PageHero,
  Skeleton,
  SkeletonText,
  Surface,
} from '@/shared/components';
import { CoverImage } from '@/shared/components/CoverImage';
import { formatNaira } from '@/shared/lib/format';
import { Box, Flex, Grid, Heading, Text, Textarea } from '@chakra-ui/react';
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  MessageCircle,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';

type ManageBookingPageProps = {
  bookingId: string;
};

function statusLabel(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'Confirmed · Paid';
    case 'pending':
      return 'Awaiting payment';
    case 'expired':
      return 'Payment expired';
    case 'cancelled':
      return 'Cancelled';
    case 'completed':
      return 'Completed';
    case 'checked_in':
      return 'Checked in';
    default:
      return status;
  }
}

function statusStyles(status: string): { bg: string; color: string } {
  switch (status) {
    case 'confirmed':
    case 'checked_in':
      return { bg: '#E6F6EC', color: 'ok' };
    case 'pending':
      return { bg: '#FFF4E5', color: 'warn' };
    case 'expired':
      return { bg: '#FDECEC', color: 'danger' };
    case 'cancelled':
      return { bg: 'bg.soft', color: 'ink.2' };
    default:
      return { bg: 'bg.soft', color: 'ink.2' };
  }
}

export function ManageBookingPage({ bookingId }: ManageBookingPageProps) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const isAuthenticated = useIsAuthenticated();
  const { data: booking, isPending, isError, error, refetch } =
    useBooking(bookingId);
  const cancelBooking = useCancelBooking();
  const startPayment = useStartBookingPayment();
  const [reason, setReason] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const cancellable = useMemo(
    () => (booking ? canCancelBooking(booking) : false),
    [booking],
  );
  const payable = useMemo(
    () => (booking ? canPayBooking(booking) : false),
    [booking],
  );

  if (!hydrated || isPending) {
    return (
      <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
        <Skeleton h="36px" w="240px" mb={6} borderRadius="full" />
        <Skeleton h="280px" borderRadius="24px" mb={6} />
        <SkeletonText lines={4} />
      </AppPage>
    );
  }

  if (isError) {
    if (isAuthApiError(error)) {
      return (
        <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
          <EmptyState
            title="Sign in to manage this booking"
            description="Your trip details are available when you’re signed in."
            actionLabel="Sign in"
            actionHref="/auth"
            mt={0}
          />
        </AppPage>
      );
    }
    return (
      <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
        <ErrorState
          title="Could not load booking"
          description={
            error instanceof Error ? error.message : 'Please try again.'
          }
          onRetry={() => void refetch()}
        />
      </AppPage>
    );
  }

  if (!booking) {
    return (
      <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
        <EmptyState
          title="Booking not found"
          description="It may have been removed, or you don’t have access to it."
          actionLabel={isAuthenticated ? 'Back to trips' : 'Go home'}
          actionHref={isAuthenticated ? '/account' : '/'}
          mt={0}
        />
      </AppPage>
    );
  }

  const styles = statusStyles(booking.status);
  const mapsUrl = booking.location_label
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.location_label)}`
    : null;

  const handlePay = async () => {
    setActionError(null);
    if (booking.checkout_url) {
      window.location.href = booking.checkout_url;
      return;
    }
    try {
      const returnUrl = `${window.location.origin}/confirmation?bookingId=${encodeURIComponent(booking.id)}&property=${encodeURIComponent(booking.property_slug)}`;
      const { checkoutUrl } = await startPayment.mutateAsync({
        bookingId: booking.id,
        returnUrl,
      });
      if (!checkoutUrl) {
        setActionError('Payment link is no longer available. Contact support.');
        return;
      }
      window.location.href = checkoutUrl;
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Could not start payment.',
      );
    }
  };

  const handleCancel = async () => {
    setActionError(null);
    try {
      await cancelBooking.mutateAsync({
        bookingId: booking.id,
        reason: reason.trim() || undefined,
      });
      setConfirmCancel(false);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Could not cancel this booking.',
      );
    }
  };

  return (
    <AppPage footer={false} mainPt={{ base: 6, md: '44px' }} mainMaxW="880px">
      <Flex mb={4}>
        <AppButton
          variant="outlineMuted"
          size="sm"
          leftIcon={<ArrowLeft size={16} strokeWidth={1.9} />}
          onClick={() => router.push(isAuthenticated ? '/account' : '/trips')}
        >
          Back to trips
        </AppButton>
      </Flex>

      <PageHero
        title="Manage booking"
        description={`${booking.property_name} · ${booking.reference}`}
        size="app"
        mb={{ base: 6, md: 8 }}
        maxW="none"
      />

      <Grid
        templateColumns={{ base: '1fr', md: '1.05fr 1fr' }}
        border="1px solid"
        borderColor="line"
        borderRadius="24px"
        overflow="hidden"
        boxShadow="md"
        mb={6}
      >
        <Box position="relative" minH={{ base: '200px', md: '320px' }}>
          <CoverImage
            src={booking.property_image}
            alt={booking.property_name}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </Box>

        <Flex direction="column" p={{ base: 5, md: '28px' }} gap="18px">
          <Flex
            as="span"
            display="inline-flex"
            alignSelf="flex-start"
            px="10px"
            py="4px"
            borderRadius="full"
            bg={styles.bg}
            color={styles.color}
            fontSize="12px"
            fontWeight="700"
          >
            {statusLabel(booking.status)}
          </Flex>

          <Box>
            <Heading
              as="h2"
              fontSize={{ base: '22px', md: '26px' }}
              fontWeight="700"
              letterSpacing="-0.01em"
            >
              {booking.property_name}
            </Heading>
            <Text color="ink.2" fontSize="14px" mt={1}>
              {booking.unit_label ? `${booking.unit_label} · ` : ''}
              {booking.location_label}
            </Text>
          </Box>

          <Grid templateColumns="1fr 1fr" gap="16px">
            <Detail
              label="Check-in"
              value={booking.check_in_label}
              icon={<CalendarDays size={15} strokeWidth={1.9} />}
            />
            <Detail label="Checkout" value={booking.check_out_label} />
            <Detail
              label="Guests"
              value={`${booking.guests} · ${booking.nights} night${booking.nights === 1 ? '' : 's'}`}
              icon={<Users size={15} strokeWidth={1.9} />}
            />
            <Detail
              label="Amount"
              value={formatNaira(booking.amount_paid)}
            />
          </Grid>
        </Flex>
      </Grid>

      <Surface radius="lg" p={{ base: '18px', md: '24px' }} mb={5}>
        <Heading as="h3" fontSize="16px" fontWeight="700" mb={3}>
          Booking details
        </Heading>
        <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="14px">
          <Detail label="Reference" value={booking.reference} mono />
          {booking.guest_name ? (
            <Detail label="Guest" value={booking.guest_name} />
          ) : null}
          {booking.guest_email ? (
            <Detail label="Email" value={booking.guest_email} />
          ) : null}
          {booking.guest_phone ? (
            <Detail label="Phone" value={booking.guest_phone} />
          ) : null}
          {booking.special_requests ? (
            <Box gridColumn={{ sm: '1 / -1' }}>
              <Detail label="Special requests" value={booking.special_requests} />
            </Box>
          ) : null}
          {booking.cancellation_reason ? (
            <Box gridColumn={{ sm: '1 / -1' }}>
              <Detail
                label="Cancellation reason"
                value={booking.cancellation_reason}
              />
            </Box>
          ) : null}
        </Grid>
      </Surface>

      {actionError ? (
        <Text color="danger" fontSize="14px" mb={4} fontWeight="600">
          {actionError}
        </Text>
      ) : null}

      <Flex
        gap="10px"
        direction={{ base: 'column', sm: 'row' }}
        flexWrap="wrap"
        mb={5}
      >
        {payable ? (
          <AppButton
            onClick={() => void handlePay()}
            disabled={startPayment.isPending}
          >
            {startPayment.isPending ? 'Opening payment…' : 'Pay now'}
          </AppButton>
        ) : null}

        {booking.status === 'expired' ||
        (booking.status === 'pending' && !payable) ? (
          <AppButton href="/search">Book again</AppButton>
        ) : null}

        {booking.status === 'expired' ? (
          <Text color="ink.2" fontSize="14px" w="full">
            The payment hold for these dates ended. Start a new booking to
            reserve them again.
          </Text>
        ) : null}

        <AppButton
          variant="outlineMuted"
          href="/contact"
          leftIcon={<MessageCircle size={16} strokeWidth={1.9} />}
        >
          Contact support
        </AppButton>

        {mapsUrl ? (
          <AppButton
            variant="outlineMuted"
            leftIcon={<MapPin size={16} strokeWidth={1.9} />}
            onClick={() =>
              window.open(mapsUrl, '_blank', 'noopener,noreferrer')
            }
          >
            Directions
          </AppButton>
        ) : null}

        <AppButton
          variant="outlineMuted"
          href={`/properties/${booking.property_slug}`}
        >
          View listing
        </AppButton>
      </Flex>

      {cancellable ? (
        <Surface radius="lg" p={{ base: '18px', md: '24px' }}>
          <Heading as="h3" fontSize="16px" fontWeight="700" mb={2}>
            Cancel booking
          </Heading>
          <Text color="ink.2" fontSize="14px" mb={4}>
            You can cancel online before check-in day. Refunds for paid stays
            are handled by our team.
          </Text>

          {!confirmCancel ? (
            <AppButton
              variant="outlineMuted"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel this booking
            </AppButton>
          ) : (
            <Flex direction="column" gap="12px">
              <Textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Reason (optional)"
                borderColor="line"
                borderRadius="12px"
                fontSize="14px"
                minH="90px"
                maxLength={500}
              />
              <Flex gap="10px" direction={{ base: 'column', sm: 'row' }}>
                <AppButton
                  variant="ink"
                  onClick={() => void handleCancel()}
                  disabled={cancelBooking.isPending}
                >
                  {cancelBooking.isPending
                    ? 'Cancelling…'
                    : 'Confirm cancellation'}
                </AppButton>
                <AppButton
                  variant="outlineMuted"
                  onClick={() => setConfirmCancel(false)}
                  disabled={cancelBooking.isPending}
                >
                  Keep booking
                </AppButton>
              </Flex>
            </Flex>
          )}
        </Surface>
      ) : null}
    </AppPage>
  );
}

function Detail({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  mono?: boolean;
}) {
  return (
    <Box>
      <Text
        fontSize="12px"
        color="ink.3"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.05em"
        mb="4px"
      >
        {label}
      </Text>
      <Flex align="center" gap="6px">
        {icon}
        <Text
          fontWeight="700"
          fontSize="14px"
          fontFamily={mono ? 'ui-monospace, monospace' : undefined}
        >
          {value}
        </Text>
      </Flex>
    </Box>
  );
}
