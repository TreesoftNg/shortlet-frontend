'use client';

import { CheckoutHeader } from '@/features/checkout/components/CheckoutHeader';
import { CheckoutSummary } from '@/features/checkout/components/CheckoutSummary';
import { FlutterwaveCheckoutLauncher } from '@/features/checkout/components/FlutterwaveCheckoutLauncher';
import type { FlutterwavePaySession } from '@/features/checkout/components/FlutterwaveCheckoutLauncher';
import { PaymentMethods } from '@/features/checkout/components/PaymentMethods';
import {
  useCheckoutGuest,
  useCheckoutProperty,
  useCheckoutQuote,
  useCreateBooking,
  type PaymentMethod,
} from '@/features/checkout/hooks/useCheckoutData';
import { getFlutterwavePublicKey } from '@/features/checkout/lib/flutterwave';
import { ApiError } from '@/data/api/http';
import { saveBookingSession } from '@/data/lib/booking-session';
import { EmptyState, ErrorState, Skeleton, SkeletonText } from '@/shared/components';
import { getDefaultStay } from '@/shared/lib/default-stay';
import { formatNaira } from '@/shared/lib/format';
import { resolvePayableAmount, toMoneyNumber } from '@/data/lib/map-booking';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Building2, ChevronLeft, Lock, Timer } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

function formatHold(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertySlug = searchParams.get('property');
  const unitId = searchParams.get('unit');
  const stayDefaults = useMemo(() => getDefaultStay(), []);
  const checkIn = searchParams.get('checkIn') ?? stayDefaults.checkIn;
  const checkOut = searchParams.get('checkOut') ?? stayDefaults.checkOut;
  const guestsParam = Number(searchParams.get('guests'));
  const guests =
    guestsParam > 0 ? Math.min(16, guestsParam) : stayDefaults.guests;

  const { data: property, isPending, isError } = useCheckoutProperty(propertySlug);
  const stay = useMemo(
    () => ({ checkIn, checkOut, guests }),
    [checkIn, checkOut, guests],
  );
  const {
    quote,
    isPending: quotePending,
    isError: quoteError,
    error: quoteErr,
    refetch: refetchQuote,
  } = useCheckoutQuote(property, unitId, stay);
  const guestProfile = useCheckoutGuest();
  const createBooking = useCreateBooking();

  const [holdSeconds, setHoldSeconds] = useState(stayDefaults.nights * 60 * 14 + 52);
  const [purpose, setPurpose] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [paySession, setPaySession] = useState<FlutterwavePaySession | null>(
    null,
  );

  useEffect(() => {
    setFirstName(guestProfile.firstName);
    setLastName(guestProfile.lastName);
    setEmail(guestProfile.email);
  }, [guestProfile.firstName, guestProfile.lastName, guestProfile.email]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHoldSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!propertySlug) {
    return (
      <Box>
        <CheckoutHeader />
        <Box px={{ base: 4, md: 10 }} py={10} maxW="720px" mx="auto">
          <EmptyState
            title="No property selected"
            description="Pick a stay first, then come back to complete checkout."
            actionLabel="Browse stays"
            actionHref="/search"
            mt={0}
            icon={<Building2 size={22} strokeWidth={1.9} />}
          />
        </Box>
      </Box>
    );
  }

  if (isPending || (property && quotePending && !quote)) {
    return (
      <Box>
        <CheckoutHeader />
        <CheckoutPageSkeleton />
      </Box>
    );
  }

  if (isError || quoteError || !property || !quote) {
    const unavailable =
      quoteErr instanceof ApiError && quoteErr.code === 'BOOKING_UNAVAILABLE';
    return (
      <Box>
        <CheckoutHeader />
        <Box px={{ base: 4, md: 10 }} py={10} maxW="720px" mx="auto">
          <ErrorState
            title={unavailable ? 'Dates unavailable' : 'Couldn’t load checkout'}
            description={
              unavailable
                ? 'Those dates are no longer free. Pick different dates and try again.'
                : quoteErr instanceof Error
                  ? quoteErr.message
                  : 'This checkout link is invalid or the stay is no longer available.'
            }
            actionLabel="Back to search"
            actionHref="/search"
            onRetry={() => {
              void refetchQuote();
            }}
            mt={0}
          />
        </Box>
      </Box>
    );
  }

  const unitLabel = quote.unit?.name ?? 'Unit';

  const handlePay = async () => {
    setFormError(null);
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Please fill in your guest details.');
      return;
    }

    const unitForBooking = quote.unit?.id || unitId || property.id;
    if (!unitForBooking) {
      setFormError('Missing unit for this booking.');
      return;
    }

    try {
      const origin = window.location.origin;
      const expectedTotal = toMoneyNumber(
        quote.apiQuote?.totalDueNow ?? quote.total,
      );
      // Include property so hosted Flutterwave return still has context;
      // bookingId is recovered from sessionStorage after redirect.
      const result = await createBooking.mutateAsync({
        returnUrl: `${origin}/confirmation?property=${encodeURIComponent(property.slug)}`,
        unitId: unitForBooking,
        checkIn: quote.checkIn,
        checkOut: quote.checkOut,
        adults: Math.max(1, guests),
        children: 0,
        infants: 0,
        guest: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        specialRequests: purpose.trim() || null,
        acceptHouseRules: true,
        expectedTotal,
      });

      const bookingId = result.id;
      if (!bookingId) {
        setFormError('Booking was created but no id was returned.');
        return;
      }

      saveBookingSession(bookingId, result.accessToken);

      const confirmationUrl = `${origin}/confirmation?bookingId=${encodeURIComponent(bookingId)}&property=${encodeURIComponent(property.slug)}`;
      const publicKey = getFlutterwavePublicKey();
      const txRef =
        result.checkout?.reference || result.checkout?.paymentReference;
      const checkoutUrl = result.checkout?.checkoutUrl;
      const payableAmount = resolvePayableAmount(result);

      // Prefer server-hosted checkout (amount set by API).
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }

      if (publicKey && txRef && payableAmount != null) {
        setPaySession({
          publicKey,
          txRef,
          bookingId,
          amount: payableAmount,
          currency:
            result.checkout?.currency ||
            result.currency ||
            quote.property.currency ||
            'NGN',
          customer: {
            email: email.trim(),
            name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            phone: phone.trim(),
          },
          title: 'Sunmade Apartments',
          description: `Stay at ${quote.property.public_name}`,
          redirectUrl: confirmationUrl,
          paymentMethod,
        });
        return;
      }

      if (publicKey && txRef && payableAmount == null) {
        setFormError(
          'Payment amount was missing from the booking response. Please try again.',
        );
        return;
      }

      router.push(confirmationUrl);
    } catch (error) {
      if (error instanceof ApiError && error.code === 'PRICE_CHANGED') {
        void refetchQuote();
        setFormError('The price changed. Review the new total and try again.');
        return;
      }
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Could not start payment.';
      setFormError(message);
    }
  };

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <CheckoutHeader />

      <Box
        as="main"
        px={{ base: 4, md: 10, lg: '160px' }}
        pb={{ base: 10, md: '80px' }}
      >
        <Flex align="center" gap="16px" my={{ base: 6, md: '44px' }}>
          <Flex
            as="button"
            w="40px"
            h="40px"
            borderRadius="full"
            bg="bg.soft"
            align="center"
            justify="center"
            cursor="pointer"
            border="none"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ChevronLeft size={20} strokeWidth={1.9} />
          </Flex>
          <Heading
            as="h1"
            fontSize={{ base: '26px', md: '30px' }}
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            Confirm and pay
          </Heading>
        </Flex>

        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 460px' }}
          gap={{ base: 8, lg: '90px' }}
        >
          <Box>
            <Flex
              align="center"
              gap="10px"
              bg="#FDF3E1"
              color="#8A5A08"
              borderRadius="12px"
              px="16px"
              py="12px"
              fontSize="14px"
              fontWeight="600"
              mb="18px"
            >
              <Timer size={18} strokeWidth={1.9} />
              We&apos;re holding {unitLabel} for you for{' '}
              <Text as="b" fontWeight="800">
                {formatHold(holdSeconds)}
              </Text>{' '}
              minutes after you start payment.
            </Flex>

            <Box py="26px" borderBottom="1px solid" borderColor="line" pt="6px">
              <Flex align="center" mb="16px">
                <Flex
                  w="28px"
                  h="28px"
                  borderRadius="full"
                  bg="ink"
                  color="white"
                  align="center"
                  justify="center"
                  fontSize="13px"
                  fontWeight="700"
                  mr="12px"
                >
                  1
                </Flex>
                <Text fontSize="18px" fontWeight="700">
                  Your trip
                </Text>
              </Flex>
              <Flex justify="space-between" mb="14px">
                <Box>
                  <Text as="b" fontWeight="700">
                    Dates
                  </Text>
                  <Text color="ink.2" fontSize="14px">
                    {quote.datesLabel}
                  </Text>
                </Box>
              </Flex>
              <Flex justify="space-between">
                <Box>
                  <Text as="b" fontWeight="700">
                    Guests
                  </Text>
                  <Text color="ink.2" fontSize="14px">
                    {quote.guests} adult{quote.guests === 1 ? '' : 's'}
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box py="26px" borderBottom="1px solid" borderColor="line">
              <Flex
                justify="space-between"
                align={{ base: 'start', sm: 'center' }}
                direction={{ base: 'column', sm: 'row' }}
                gap={2}
                mb="16px"
              >
                <Flex align="center">
                  <Flex
                    w="28px"
                    h="28px"
                    borderRadius="full"
                    bg="ink"
                    color="white"
                    align="center"
                    justify="center"
                    fontSize="13px"
                    fontWeight="700"
                    mr="12px"
                  >
                    2
                  </Flex>
                  <Text fontSize="18px" fontWeight="700">
                    Guest details
                  </Text>
                </Flex>
                {guestProfile.isSignedIn ? (
                  <Text color="ink.2" fontSize="14px">
                    Signed in as{' '}
                    <Text as="b" color="ink" fontWeight="700">
                      {guestProfile.username || guestProfile.email}
                    </Text>
                  </Text>
                ) : null}
              </Flex>

              <Grid
                templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
                gap="12px"
              >
                {(
                  [
                    ['First name', firstName, setFirstName],
                    ['Last name', lastName, setLastName],
                    ['Email', email, setEmail],
                    ['Phone', phone, setPhone],
                  ] as const
                ).map(([label, value, setter]) => (
                  <Box
                    key={label}
                    border="1px solid"
                    borderColor="#D5D5D0"
                    borderRadius="12px"
                    px="16px"
                    py="12px"
                  >
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.04em"
                    >
                      {label}
                    </Text>
                    <Input
                      unstyled
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      fontSize="15px"
                      mt={1}
                      w="full"
                      outline="none"
                    />
                  </Box>
                ))}
              </Grid>

              <Box
                mt="12px"
                border="1px solid"
                borderColor="#D5D5D0"
                borderRadius="12px"
                px="16px"
                py="12px"
              >
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.04em"
                  mb={1}
                >
                  Purpose of stay (optional)
                </Text>
                <Textarea
                  unstyled
                  placeholder="e.g. Business trip, family visit…"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  fontSize="15px"
                  color="ink"
                  _placeholder={{ color: 'ink.3' }}
                  rows={2}
                  resize="none"
                  w="full"
                  outline="none"
                />
              </Box>
            </Box>

            <Box py="26px" borderBottom="1px solid" borderColor="line">
              <PaymentMethods
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </Box>

            <Box py="26px">
              <Text fontSize="18px" fontWeight="700" mb="10px">
                Cancellation policy
              </Text>
              <Text color="ink.2" fontSize="14px">
                Cancel before check-in for a partial refund according to the
                house rules. Caution deposit is refunded after checkout.
              </Text>

              <Text color="ink.3" fontSize="13px" my="26px">
                By selecting the button below, I agree to the House Rules,
                Cancellation Policy and Terms of Service.
              </Text>

              {formError ? (
                <Text color="danger" fontSize="14px" mb="14px">
                  {formError}
                </Text>
              ) : null}

              <Button
                h="56px"
                px="40px"
                borderRadius="12px"
                bg="brand.500"
                color="white"
                fontWeight="700"
                fontSize="16px"
                gap="8px"
                w={{ base: 'full', sm: 'auto' }}
                _hover={{ bg: 'brand.600' }}
                loading={createBooking.isPending}
                onClick={() => {
                  void handlePay();
                }}
              >
                <Lock size={18} strokeWidth={1.9} />
                Pay {formatNaira(quote.total)}
              </Button>
            </Box>
          </Box>

          <Box>
            <CheckoutSummary quote={quote} />
          </Box>
        </Grid>
      </Box>
      {paySession ? (
        <FlutterwaveCheckoutLauncher
          session={paySession}
          onSuccess={(transactionId) => {
            const params = new URLSearchParams({
              bookingId: paySession.bookingId,
              property: property.slug,
            });
            if (transactionId) params.set('transaction_id', transactionId);
            setPaySession(null);
            router.push(`/confirmation?${params.toString()}`);
          }}
          onClose={() => {
            setPaySession(null);
          }}
        />
      ) : null}
    </Box>
  );
}

function CheckoutPageSkeleton() {
  return (
    <Box
      px={{ base: 4, md: 10, lg: '160px' }}
      py={{ base: 6, md: '44px' }}
      aria-busy="true"
    >
      <Skeleton h="28px" w="200px" mb={8} borderRadius="full" />
      <Grid templateColumns={{ base: '1fr', lg: '1.2fr 0.8fr' }} gap={8}>
        <Box>
          <SkeletonText lines={3} />
          <Skeleton h="120px" mt={6} borderRadius="lg" />
          <Skeleton h="160px" mt={6} borderRadius="lg" />
        </Box>
        <Skeleton h="320px" borderRadius="22px" />
      </Grid>
    </Box>
  );
}
