'use client';

import { ApiError } from '@/data/api/http';
import { toMoneyNumber } from '@/data/lib/map-booking';
import { quoteErrorMessage } from '@/data/lib/quote-error';
import { useUnitQuote } from '@/features/property/hooks/usePropertyData';
import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { Skeleton } from '@/shared/components';
import { minBookableDate } from '@/shared/lib/default-stay';
import {
  formatNaira,
  formatShortDate,
  guestsLabel,
  nightsBetween,
} from '@/shared/lib/format';
import {
  DEFAULT_STAY_LIMITS,
  earliestCheckOut,
  fitCheckOutToLimits,
  latestCheckOut,
  stayLengthProblem,
  stayLimitsHint,
} from '@/shared/lib/stay-length';
import type { Property, Unit } from '@/data/types';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type BookingCardProps = {
  property: Property;
  selectedUnit: Unit | null;
};

function isDatesUnavailableError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  return (
    error.code === 'BOOKING_UNAVAILABLE' ||
    error.status === 409
  );
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
  const unitId = selectedUnit?.id ?? property.id;
  const stayLimits = selectedUnit?.stay_limits ?? DEFAULT_STAY_LIMITS;
  const stayProblem = stayLengthProblem(checkIn, checkOut, stayLimits);
  const limitsHint = stayLimitsHint(stayLimits);

  useEffect(() => {
    if (guests > maxGuests) setGuests(maxGuests);
  }, [guests, maxGuests, setGuests]);

  const {
    data: quoteData,
    isPending: quotePending,
    isError: quoteError,
    error: quoteErr,
    refetch: refetchQuote,
  } = useUnitQuote(
    // The API rejects stays outside the unit's limits; don't ask for them.
    unitId && checkIn && checkOut && guests > 0 && !stayProblem
      ? { unitId, checkIn, checkOut, adults: guests }
      : null,
  );
  // keepPreviousData would otherwise keep showing the last valid stay's price.
  const apiQuote = stayProblem ? undefined : quoteData;

  const listingNightly =
    selectedUnit?.nightly_rate ?? property.pricing.nightly_rate;
  const quoteNights = apiQuote?.nights || nights;
  const stay = toMoneyNumber(apiQuote?.price.nightsSubtotal);
  const nightly =
    apiQuote && quoteNights > 0 ? stay / quoteNights : listingNightly;
  const cleaning = toMoneyNumber(apiQuote?.price.cleaningFee);
  const service = toMoneyNumber(apiQuote?.price.serviceFee?.amount);
  const tax = toMoneyNumber(apiQuote?.price.tax?.amount);
  const deposit = toMoneyNumber(apiQuote?.deposit.amount);
  const total = toMoneyNumber(apiQuote?.totalDueNow);
  const showQuote = Boolean(apiQuote);
  const quoteBusy = quotePending && !apiQuote;
  const datesUnavailable =
    quoteError && !apiQuote && isDatesUnavailableError(quoteErr);

  const lines = useMemo(
    () => [
      {
        label: `${formatNaira(nightly)} × ${quoteNights} night${quoteNights === 1 ? '' : 's'}`,
        amount: stay,
      },
      { label: 'Cleaning fee', amount: cleaning },
      { label: 'Service fee', amount: service },
      ...(tax > 0 ? [{ label: 'Tax', amount: tax }] : []),
      { label: 'Caution deposit (refundable)', amount: deposit },
    ],
    [nightly, quoteNights, stay, cleaning, service, tax, deposit],
  );

  const applyDates = (nextIn: string, nextOut: string) => {
    const start = nextIn || checkIn;
    const end = fitCheckOutToLimits(start, nextOut || checkOut, stayLimits);
    setDates(start, end);
  };

  const clampedGuests = Math.min(guests, maxGuests);

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
              display={formatShortDate(checkIn)}
              min={minBookableDate()}
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
              display={formatShortDate(checkOut)}
              min={earliestCheckOut(checkIn, stayLimits)}
              max={latestCheckOut(checkIn, stayLimits) ?? undefined}
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
                {guestsLabel(clampedGuests)}
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
                  disabled={clampedGuests <= 1}
                  onClick={() => setGuests(clampedGuests - 1)}
                >
                  <Minus size={16} strokeWidth={2} />
                </StepButton>
                <Text minW="24px" textAlign="center" fontWeight="700">
                  {clampedGuests}
                </Text>
                <StepButton
                  ariaLabel="More guests"
                  disabled={clampedGuests >= maxGuests}
                  onClick={() => setGuests(clampedGuests + 1)}
                >
                  <Plus size={16} strokeWidth={2} />
                </StepButton>
              </Flex>
            </Flex>
          ) : null}
        </Box>

        {limitsHint ? (
          <Text fontSize="13px" color="ink.3" mt="-8px" mb="16px">
            {limitsHint}
          </Text>
        ) : null}

        <Button
          type="button"
          w="full"
          h="54px"
          borderRadius="12px"
          bg="brand.500"
          color="white"
          fontWeight="700"
          fontSize="15px"
          _hover={{ bg: 'brand.600' }}
          disabled={Boolean(datesUnavailable || stayProblem)}
          onClick={() =>
            router.push(
              `/checkout?property=${property.slug}${selectedUnit ? `&unit=${selectedUnit.id}` : ''}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${clampedGuests}`,
            )
          }
        >
          Reserve
        </Button>
        <Text textAlign="center" fontSize="13px" color="ink.3" mt="10px">
          You won&apos;t be charged yet
        </Text>

        {stayProblem ? (
          <Box mt="16px">
            <Text color="ink.2" fontSize="14px">
              {stayProblem}. Please pick different dates.
            </Text>
          </Box>
        ) : quoteBusy ? (
          <Box mt="12px" aria-busy="true">
            <Skeleton h="18px" mb="14px" borderRadius="full" />
            <Skeleton h="18px" mb="14px" borderRadius="full" />
            <Skeleton h="18px" mb="14px" w="70%" borderRadius="full" />
            <Skeleton h="22px" mt="8px" borderRadius="full" />
          </Box>
        ) : datesUnavailable ? (
          <Box mt="16px">
            <Text color="ink.2" fontSize="14px">
              These dates are already booked. Please pick different dates.
            </Text>
          </Box>
        ) : quoteError && !apiQuote ? (
          <Box mt="16px">
            <Text color="ink.2" fontSize="14px" mb="10px">
              {quoteErrorMessage(
                quoteErr,
                'Couldn’t load the live price for these dates.',
              )}
            </Text>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                void refetchQuote();
              }}
            >
              Try again
            </Button>
          </Box>
        ) : showQuote ? (
          <>
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
          </>
        ) : null}
      </Box>
    </Box>
  );
}

function DateCell({
  label,
  value,
  display,
  min,
  max,
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
  max?: string;
  editing: boolean;
  borderRight?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep a stable native input mounted; open its picker explicitly.
  // Closing on blur was killing the Chrome calendar before a date could be chosen.
  const openPicker = () => {
    onOpen();
    const el = inputRef.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      // Older browsers: focus is enough for the native control.
      el.focus();
    }
  };

  return (
    <Box
      flex="1"
      p="10px 14px"
      borderRight={borderRight ? '1px solid #C9C9C4' : undefined}
      bg={editing ? 'bg.soft' : 'transparent'}
      position="relative"
      cursor="pointer"
      onClick={openPicker}
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
      <Text fontSize="15px" color="ink.2" mt="4px" pointerEvents="none">
        {display}
      </Text>
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          openPicker();
        }}
        onChange={(e) => {
          onChange(e.target.value);
          onClose();
        }}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'transparent',
        }}
      />
    </Box>
  );
}

function StepButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
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
