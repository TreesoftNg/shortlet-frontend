'use client';

import { DEMO_STAY } from '@/data/demo-stay';
import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { AccountMenuButton } from '@/shared/components';
import { SunmadeLogo } from '@/shared/components/brand';
import {
  formatDatesRangeLabel,
  guestsLabel,
  nightsBetween,
  parseISODate,
  toISODate,
} from '@/shared/lib/format';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { Minus, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type PropertyHeaderBarProps = {
  locationLabel: string;
  searchHref?: string;
};

type EditField = 'dates' | 'guests';

const DATE_PRESETS = [
  { label: 'Oct 12 – 16', checkIn: '2026-10-12', checkOut: '2026-10-16' },
  { label: 'Oct 17 – 20', checkIn: '2026-10-17', checkOut: '2026-10-20' },
  { label: 'Oct 24 – 28', checkIn: '2026-10-24', checkOut: '2026-10-28' },
  { label: 'Nov 1 – 5', checkIn: '2026-11-01', checkOut: '2026-11-05' },
] as const;

export function PropertyHeaderBar({
  locationLabel,
  searchHref = '/search',
}: PropertyHeaderBarProps) {
  const router = useRouter();
  const [open, setOpen] = useState<EditField | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const guests = usePropertyBookingStore((s) => s.guests);
  const checkIn = usePropertyBookingStore((s) => s.checkIn);
  const checkOut = usePropertyBookingStore((s) => s.checkOut);
  const setGuests = usePropertyBookingStore((s) => s.setGuests);
  const setDates = usePropertyBookingStore((s) => s.setDates);

  const datesLabel = formatDatesRangeLabel(checkIn, checkOut);
  const guestsText = guestsLabel(guests);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

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
    <Flex
      as="header"
      h={{ base: '64px', md: '72px', lg: '80px' }}
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8, lg: '120px' }}
      borderBottom="1px solid"
      borderColor="line"
      bg="bg"
      gap={3}
      position="sticky"
      top={0}
      zIndex={40}
      maxW="1440px"
      mx="auto"
      w="full"
    >
      <Flex asChild align="center" h="full" flexShrink={0}>
        <Link href="/">
          <SunmadeLogo
            size={{ base: '17px', md: '20px' }}
            wordmarkDisplay={{ base: 'none', sm: 'inline-grid' }}
          />
        </Link>
      </Flex>

      <Box
        ref={rootRef}
        position="relative"
        flex="1"
        maxW="480px"
        display={{ base: 'none', md: 'block' }}
      >
        <Flex
          align="center"
          gap={0}
          border="1px solid"
          borderColor={open ? 'ink' : 'line'}
          borderRadius="full"
          pl="8px"
          pr="8px"
          py="8px"
          fontSize="14px"
          fontWeight="600"
          boxShadow={
            open
              ? '0 4px 18px rgba(0,0,0,.10)'
              : '0 2px 10px rgba(0,0,0,.06)'
          }
          bg="bg"
        >
          <Flex
            as="button"
            align="center"
            px="14px"
            py="6px"
            borderRadius="full"
            border="none"
            bg="transparent"
            cursor="pointer"
            minW={0}
            flex="1.1"
            textAlign="left"
            _hover={{ bg: 'bg.soft' }}
            onClick={() => router.push(searchHref)}
            title="Search this area"
          >
            <Text lineClamp={1}>{locationLabel}</Text>
          </Flex>

          <Box w="1px" h="22px" bg="line" flexShrink={0} />

          <Flex
            as="button"
            align="center"
            px="14px"
            py="6px"
            borderRadius="full"
            border="none"
            bg={open === 'dates' ? 'bg.soft' : 'transparent'}
            cursor="pointer"
            flex="1"
            minW={0}
            textAlign="left"
            _hover={{ bg: 'bg.soft' }}
            onClick={() =>
              setOpen((prev) => (prev === 'dates' ? null : 'dates'))
            }
          >
            <Text lineClamp={1}>{datesLabel}</Text>
          </Flex>

          <Box w="1px" h="22px" bg="line" flexShrink={0} />

          <Flex
            as="button"
            align="center"
            px="14px"
            py="6px"
            borderRadius="full"
            border="none"
            bg={open === 'guests' ? 'bg.soft' : 'transparent'}
            color={open === 'guests' ? 'ink' : 'ink.3'}
            cursor="pointer"
            flex="0.9"
            minW={0}
            textAlign="left"
            _hover={{ bg: 'bg.soft' }}
            onClick={() =>
              setOpen((prev) => (prev === 'guests' ? null : 'guests'))
            }
          >
            <Text lineClamp={1}>{guestsText}</Text>
          </Flex>

          <Flex
            as="button"
            ml="auto"
            w="34px"
            h="34px"
            borderRadius="full"
            bg="brand.500"
            color="white"
            align="center"
            justify="center"
            flexShrink={0}
            border="none"
            cursor="pointer"
            aria-label="Search stays"
            _hover={{ bg: 'brand.600' }}
            onClick={() => router.push(searchHref)}
          >
            <Search size={16} strokeWidth={1.9} />
          </Flex>
        </Flex>

        {open ? (
          <Box
            position="absolute"
            top="calc(100% + 10px)"
            left={0}
            right={0}
            bg="bg"
            border="1px solid"
            borderColor="line"
            borderRadius="22px"
            boxShadow="0 12px 40px rgba(0,0,0,.14)"
            p={5}
            zIndex={50}
          >
            {open === 'dates' ? (
              <Box>
                <Text fontSize="12px" fontWeight="700" color="ink.3" mb={3}>
                  When
                </Text>
                <Flex gap={3} mb={4}>
                  <Box flex="1">
                    <Text fontSize="12px" fontWeight="700" mb="6px">
                      Check in
                    </Text>
                    <Input
                      type="date"
                      value={checkIn}
                      min={DEMO_STAY.checkIn}
                      onChange={(e) => applyDates(e.target.value, checkOut)}
                      borderColor="line"
                      borderRadius="12px"
                      h="44px"
                      px="12px"
                      fontSize="14px"
                      fontWeight="600"
                    />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="12px" fontWeight="700" mb="6px">
                      Check out
                    </Text>
                    <Input
                      type="date"
                      value={checkOut}
                      min={checkIn}
                      onChange={(e) => applyDates(checkIn, e.target.value)}
                      borderColor="line"
                      borderRadius="12px"
                      h="44px"
                      px="12px"
                      fontSize="14px"
                      fontWeight="600"
                    />
                  </Box>
                </Flex>
                <Flex gap="8px" flexWrap="wrap">
                  {DATE_PRESETS.map((preset) => {
                    const selected =
                      checkIn === preset.checkIn &&
                      checkOut === preset.checkOut;
                    return (
                      <Flex
                        key={preset.label}
                        as="button"
                        px="14px"
                        py="8px"
                        borderRadius="full"
                        border="1px solid"
                        borderColor={selected ? 'ink' : 'line'}
                        bg={selected ? 'bg.soft' : 'bg'}
                        fontSize="13px"
                        fontWeight="600"
                        cursor="pointer"
                        onClick={() => {
                          applyDates(preset.checkIn, preset.checkOut);
                          setOpen(null);
                        }}
                      >
                        {preset.label}
                      </Flex>
                    );
                  })}
                </Flex>
                <Text color="ink.3" fontSize="13px" mt={3}>
                  {nightsBetween(checkIn, checkOut)} night
                  {nightsBetween(checkIn, checkOut) === 1 ? '' : 's'}
                </Text>
              </Box>
            ) : null}

            {open === 'guests' ? (
              <Flex align="center" justify="space-between" gap={4}>
                <Box>
                  <Text fontWeight="700">Guests</Text>
                  <Text color="ink.3" fontSize="13px" mt="2px">
                    Ages 13 or above
                  </Text>
                </Box>
                <Flex align="center" gap="14px">
                  <Flex
                    as="button"
                    w="36px"
                    h="36px"
                    borderRadius="full"
                    border="1px solid"
                    borderColor="line"
                    align="center"
                    justify="center"
                    cursor={guests <= 1 ? 'not-allowed' : 'pointer'}
                    opacity={guests <= 1 ? 0.4 : 1}
                    aria-disabled={guests <= 1}
                    aria-label="Fewer guests"
                    onClick={() => {
                      if (guests <= 1) return;
                      setGuests(guests - 1);
                    }}
                  >
                    <Minus size={16} strokeWidth={2} />
                  </Flex>
                  <Text minW="28px" textAlign="center" fontWeight="700">
                    {guests}
                  </Text>
                  <Flex
                    as="button"
                    w="36px"
                    h="36px"
                    borderRadius="full"
                    border="1px solid"
                    borderColor="line"
                    align="center"
                    justify="center"
                    cursor={guests >= 16 ? 'not-allowed' : 'pointer'}
                    opacity={guests >= 16 ? 0.4 : 1}
                    aria-disabled={guests >= 16}
                    aria-label="More guests"
                    onClick={() => {
                      if (guests >= 16) return;
                      setGuests(guests + 1);
                    }}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </Flex>
                </Flex>
              </Flex>
            ) : null}
          </Box>
        ) : null}
      </Box>

      <Flex
        align="center"
        gap="14px"
        fontSize="14px"
        fontWeight="600"
        flexShrink={0}
      >
        <Text display={{ base: 'none', lg: 'block' }}>₦ NGN</Text>
        <AccountMenuButton />
      </Flex>
    </Flex>
  );
}
