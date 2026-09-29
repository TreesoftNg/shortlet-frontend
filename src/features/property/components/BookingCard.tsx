'use client';

import { DEMO_STAY } from '@/data/demo-stay';
import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import {
  formatNaira,
  guestsLabel,
  nightsBetween,
  parseISODate,
  toISODate,
} from '@/shared/lib/format';
import { tokens } from '@/shared/theme/tokens';
import type { Property, Unit } from '@/data/types';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronUp, Gem, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type BookingCardProps = {
  property: Property;
  selectedUnit: Unit | null;
};

function shortDateLabel(iso: string) {
  return parseISODate(iso).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BookingCard({ property, selectedUnit }: BookingCardProps) {
  const router = useRouter();
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<'checkIn' | 'checkOut' | null>(
    null,
  );

  const guests = usePropertyBookingStore((s) => s.guests);
  const checkIn = usePropertyBookingStore((s) => s.checkIn);
  const checkOut = usePropertyBookingStore((s) => s.checkOut);
  const setGuests = usePropertyBookingStore((s) => s.setGuests);
  const setDates = usePropertyBookingStore((s) => s.setDates);

  const nights = nightsBetween(checkIn, checkOut);
  const maxGuests = Math.max(
    1,
    selectedUnit?.capacity.max ?? property.capacity.max ?? 16,
  );

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
        label: `${formatNaira(nightly)} × ${nights} night${nights === 1 ? '' : 's'}`,
        amount: stay,
      },
      { label: 'Cleaning fee', amount: cleaning },
      { label: 'Service fee', amount: service },
      { label: 'Caution deposit (refundable)', amount: deposit },
    ],
    [nightly, nights, stay, cleaning, service, deposit],
  );

  const applyDates = (nextIn: string, nextOut: string) => {
    let start = nextIn || checkIn;
    let end = nextOut || checkOut;
    if (parseISODate(end) <= parseISODate(start)) {
      const bumped = parseISODate(start);
      bumped.setDate(bumped.getDate() + 1);
      end = toISODate(bumped);
    }
    setDates(start, end);
  };

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
            <DateCell
              label="Check-in"
              value={checkIn}
              display={shortDateLabel(checkIn)}
              min={DEMO_STAY.checkIn}
              editing={editingDate === 'checkIn'}
              borderRight
              onOpen={() => {
                setEditingDate('checkIn');
                setGuestsOpen(false);
              }}
              onClose={() => setEditingDate(null)}
              onChange={(value) => {
                applyDates(value, checkOut);
                setEditingDate(null);
              }}
            />
            <DateCell
              label="Checkout"
              value={checkOut}
              display={shortDateLabel(checkOut)}
              min={checkIn}
              editing={editingDate === 'checkOut'}
              onOpen={() => {
                setEditingDate('checkOut');
                setGuestsOpen(false);
              }}
              onClose={() => setEditingDate(null)}
              onChange={(value) => {
                applyDates(checkIn, value);
                setEditingDate(null);
              }}
            />
          </Flex>

          <Flex
            as="button"
            w="full"
            justify="space-between"
            align="center"
            p="10px 14px"
            borderTop="1px solid #C9C9C4"
            border="none"
            bg={guestsOpen ? 'bg.soft' : 'transparent'}
            cursor="pointer"
            textAlign="left"
            _hover={{ bg: 'bg.soft' }}
            onClick={() => {
              setGuestsOpen((open) => !open);
              setEditingDate(null);
            }}
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
                {guestsLabel(guests)}
              </Text>
            </Box>
            {guestsOpen ? (
              <ChevronUp size={18} strokeWidth={1.9} />
            ) : (
              <ChevronDown size={18} strokeWidth={1.9} />
            )}
          </Flex>

          {guestsOpen ? (
            <Flex
              align="center"
              justify="space-between"
              gap={4}
              px="14px"
              py="14px"
              borderTop="1px solid #C9C9C4"
              bg="bg.soft"
            >
              <Box>
                <Text fontWeight="700" fontSize="14px">
                  Adults
                </Text>
                <Text color="ink.3" fontSize="12px" mt="2px">
                  Ages 13 or above · max {maxGuests}
                </Text>
              </Box>
              <Flex align="center" gap="12px">
                <StepButton
                  ariaLabel="Fewer guests"
                  disabled={guests <= 1}
                  onClick={() => setGuests(guests - 1)}
                >
                  <Minus size={16} strokeWidth={2} />
                </StepButton>
                <Text minW="24px" textAlign="center" fontWeight="700">
                  {guests}
                </Text>
                <StepButton
                  ariaLabel="More guests"
                  disabled={guests >= maxGuests}
                  onClick={() => setGuests(guests + 1)}
                >
                  <Plus size={16} strokeWidth={2} />
                </StepButton>
              </Flex>
            </Flex>
          ) : null}
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
        <Text textAlign="center" fontSize="13px" color="ink.3" mt="10px">
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

function DateCell({
  label,
  value,
  display,
  min,
  editing,
  borderRight,
  onOpen,
  onClose,
  onChange,
}: {
  label: string;
  value: string;
  display: string;
  min?: string;
  editing: boolean;
  borderRight?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <Box
      flex="1"
      p="10px 14px"
      borderRight={borderRight ? '1px solid #C9C9C4' : undefined}
      bg={editing ? 'bg.soft' : 'transparent'}
      position="relative"
      cursor="pointer"
      onClick={() => {
        if (!editing) onOpen();
      }}
      _hover={{ bg: 'bg.soft' }}
    >
      <Text
        fontSize="11px"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.04em"
      >
        {label}
      </Text>
      {editing ? (
        <Input
          type="date"
          value={value}
          min={min}
          autoFocus
          mt="4px"
          h="32px"
          px="8px"
          fontSize="14px"
          fontWeight="600"
          borderColor="line"
          borderRadius="8px"
          bg="white"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onClose}
        />
      ) : (
        <Text fontSize="15px" color="ink.2">
          {display}
        </Text>
      )}
    </Box>
  );
}

function StepButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <Flex
      as="button"
      w="32px"
      h="32px"
      borderRadius="full"
      border="1px solid"
      borderColor="line"
      align="center"
      justify="center"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.4 : 1}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      bg="white"
      _hover={disabled ? undefined : { bg: 'bg' }}
      onClick={(e) => {
        e.stopPropagation();
        if (disabled) return;
        onClick();
      }}
    >
      {children}
    </Flex>
  );
}
