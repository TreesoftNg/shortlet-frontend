'use client';

import { CheckoutHeader } from '@/features/checkout/components/CheckoutHeader';
import { CheckoutSummary } from '@/features/checkout/components/CheckoutSummary';
import { PaymentMethods } from '@/features/checkout/components/PaymentMethods';
import {
  mockGuest,
  useCheckoutProperty,
  useCheckoutQuote,
} from '@/features/checkout/hooks/useCheckoutData';
import { useCheckoutStore } from '@/features/checkout/store/checkout-store';
import { formatNaira } from '@/shared/lib/format';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ChevronLeft, Lock, Timer } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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

  const { data: property } = useCheckoutProperty(propertySlug);
  const quote = useCheckoutQuote(property, unitId);

  const holdSeconds = useCheckoutStore((s) => s.holdSeconds);
  const purpose = useCheckoutStore((s) => s.purpose);
  const setPurpose = useCheckoutStore((s) => s.setPurpose);
  const tickHold = useCheckoutStore((s) => s.tickHold);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);

  useEffect(() => {
    const id = window.setInterval(() => tickHold(), 1000);
    return () => window.clearInterval(id);
  }, [tickHold]);

  if (!propertySlug) {
    return (
      <Box>
        <CheckoutHeader />
        <Box p={10} textAlign="center">
          <Heading mb={4}>No property selected</Heading>
          <Button onClick={() => router.push('/search')}>Browse stays</Button>
        </Box>
      </Box>
    );
  }

  if (!property || !quote) {
    return (
      <Box>
        <CheckoutHeader />
        <Box p={10} textAlign="center">
          <Heading mb={4}>Property not found</Heading>
          <Button onClick={() => router.push('/search')}>Back to search</Button>
        </Box>
      </Box>
    );
  }

  const unitLabel = quote.unit?.name ?? 'Unit';

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
              minutes.
            </Flex>

            {/* Step 1 — trip */}
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
                <Text as="u" fontWeight="700" cursor="pointer">
                  Edit
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Box>
                  <Text as="b" fontWeight="700">
                    Guests
                  </Text>
                  <Text color="ink.2" fontSize="14px">
                    {quote.guests} adults
                  </Text>
                </Box>
                <Text as="u" fontWeight="700" cursor="pointer">
                  Edit
                </Text>
              </Flex>
            </Box>

            {/* Step 2 — guest */}
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
                <Text color="ink.2" fontSize="14px">
                  Signed in as{' '}
                  <Text as="b" color="ink" fontWeight="700">
                    {mockGuest.username}
                  </Text>
                </Text>
              </Flex>

              <Grid
                templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
                gap="12px"
              >
                {[
                  { label: 'First name', value: mockGuest.firstName },
                  { label: 'Last name', value: mockGuest.lastName },
                  { label: 'Email', value: mockGuest.email },
                  { label: 'Phone', value: mockGuest.phone },
                ].map((field) => (
                  <Box
                    key={field.label}
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
                      {field.label}
                    </Text>
                    <Text fontSize="15px">{field.value}</Text>
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

            {/* Step 3 — pay */}
            <Box py="26px" borderBottom="1px solid" borderColor="line">
              <PaymentMethods />
            </Box>

            {/* Policy + pay CTA */}
            <Box py="26px">
              <Text fontSize="18px" fontWeight="700" mb="10px">
                Cancellation policy
              </Text>
              <Text color="ink.2" fontSize="14px">
                <Text as="b" color="ink" fontWeight="700">
                  Free cancellation before Oct 10.{' '}
                </Text>
                Cancel before check-in on Oct 12 for a 50% refund. Caution
                deposit is refunded within 48 hours after checkout.{' '}
                <Text as="u" color="ink" fontWeight="700" cursor="pointer">
                  Learn more
                </Text>
              </Text>

              <Text color="ink.3" fontSize="13px" my="26px">
                By selecting the button below, I agree to the House Rules,
                Cancellation Policy and Terms of Service.
              </Text>

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
                onClick={() =>
                  router.push(
                    `/confirmation?property=${property.slug}${quote.unit ? `&unit=${quote.unit.id}` : ''}&method=${paymentMethod}&total=${quote.total}`,
                  )
                }
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
    </Box>
  );
}
