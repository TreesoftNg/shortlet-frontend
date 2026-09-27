'use client';

import { DEMO_STAY } from '@/data/demo-stay';
import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { formatNaira } from '@/shared/lib/format';
import { tokens } from '@/shared/theme/tokens';
import type { Property, Unit } from '@/data/types';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChevronDown, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type BookingCardProps = {
  property: Property;
  selectedUnit: Unit | null;
};

export function BookingCard({ property, selectedUnit }: BookingCardProps) {
  const router = useRouter();
  const guests = usePropertyBookingStore((s) => s.guests);
  const nights = DEMO_STAY.nights;
  const checkInLabel = DEMO_STAY.checkInLabel;
  const checkOutLabel = DEMO_STAY.checkOutLabel;

  const nightly =
    selectedUnit?.nightly_rate ?? property.pricing.nightly_rate;
  const stay = nightly * nights;
  const cleaning = property.pricing.cleaning_fee;
  const service = property.pricing.service_fee;
  const deposit = property.pricing.caution_deposit;
  const total = stay + cleaning + service + deposit;

  const lines = useMemo(
    () => [
      {
        label: `${formatNaira(nightly)} × ${nights} nights`,
        amount: stay,
      },
      { label: 'Cleaning fee', amount: cleaning },
      { label: 'Service fee', amount: service },
      { label: 'Caution deposit (refundable)', amount: deposit },
    ],
    [nightly, nights, stay, cleaning, service, deposit],
  );

  return (
    <Box>
      <Box
        border="1px solid"
        borderColor="line"
        borderRadius="22px"
        p="26px"
        boxShadow="lg"
        bg="white"
        position={{ lg: 'sticky' }}
        top={{ lg: '24px' }}
      >
        <Text>
          <Text as="span" fontSize="24px" fontWeight="800">
            {formatNaira(nightly)}
          </Text>{' '}
          <Text as="span" color="ink.3">
            night
          </Text>
        </Text>

        <Box
          border="1px solid"
          borderColor="#C9C9C4"
          borderRadius="12px"
          my="20px"
          overflow="hidden"
        >
          <Flex>
            <Box flex="1" p="10px 14px" borderRight="1px solid #C9C9C4">
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                Check-in
              </Text>
              <Text fontSize="15px" color="ink.2">
                {checkInLabel}
              </Text>
            </Box>
            <Box flex="1" p="10px 14px">
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                Checkout
              </Text>
              <Text fontSize="15px" color="ink.2">
                {checkOutLabel}
              </Text>
            </Box>
          </Flex>
          <Flex
            justify="space-between"
            align="center"
            p="10px 14px"
            borderTop="1px solid #C9C9C4"
          >
            <Box>
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.04em"
              >
                Guests
              </Text>
              <Text fontSize="15px" color="ink.2">
                {guests} guests
              </Text>
            </Box>
            <ChevronDown size={18} strokeWidth={1.9} />
          </Flex>
        </Box>

        <Button
          w="full"
          h="54px"
          borderRadius="12px"
          bg="brand.500"
          color="white"
          fontWeight="700"
          fontSize="15px"
          _hover={{ bg: 'brand.600' }}
          onClick={() =>
            router.push(
              `/checkout?property=${property.slug}${selectedUnit ? `&unit=${selectedUnit.id}` : ''}`,
            )
          }
        >
          Reserve
        </Button>
        <Text
          textAlign="center"
          fontSize="13px"
          color="ink.3"
          mt="10px"
        >
          You won&apos;t be charged yet
        </Text>

        {lines.map((line) => (
          <Flex
            key={line.label}
            justify="space-between"
            my="12px"
            color="ink.2"
            fontSize="15px"
          >
            <Text textDecoration="underline">{line.label}</Text>
            <Text>{formatNaira(line.amount)}</Text>
          </Flex>
        ))}

        <Flex
          justify="space-between"
          fontWeight="800"
          fontSize="16px"
          pt="16px"
          borderTop="1px solid"
          borderColor="line"
          mt="16px"
        >
          <Text>Total</Text>
          <Text>{formatNaira(total)}</Text>
        </Flex>
      </Box>

      <Flex
        gap="12px"
        align="center"
        mt="18px"
        p="18px"
        border="1px solid"
        borderColor="line"
        borderRadius="16px"
        fontSize="14px"
      >
        <Gem size={26} strokeWidth={1.9} color={tokens.colors.brand[500]} />
        <Text>
          <Text as="b" fontWeight="700">
            Great price.{' '}
          </Text>
          <Text as="span" color="ink.2">
            This stay is ₦12,000 less than similar apartments nearby.
          </Text>
        </Text>
      </Flex>
    </Box>
  );
}
