'use client';

import { useNeighborhoods } from '@/data/hooks';
import { DEMO_STAY } from '@/data/demo-stay';
import type { SearchFilters } from '@/features/search/hooks/useSearchData';
import { AccountMenuButton } from '@/shared/components/AccountMenuButton';
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
import { useEffect, useRef, useState } from 'react';

type SearchField = 'location' | 'dates' | 'guests';

type SearchMiniBarProps = {
  filters: SearchFilters;
  locationLabel: string;
  onChange: (next: SearchFilters) => void;
};

const DATE_PRESETS = [
  { label: 'Oct 12 – 16', checkIn: '2026-10-12', checkOut: '2026-10-16' },
  { label: 'Oct 17 – 20', checkIn: '2026-10-17', checkOut: '2026-10-20' },
  { label: 'Oct 24 – 28', checkIn: '2026-10-24', checkOut: '2026-10-28' },
  { label: 'Nov 1 – 5', checkIn: '2026-11-01', checkOut: '2026-11-05' },
] as const;

export function SearchMiniBar({
  filters,
  locationLabel,
  onChange,
}: SearchMiniBarProps) {
  const [open, setOpen] = useState<SearchField | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { data: neighborhoods = [] } = useNeighborhoods();

  const datesLabel = formatDatesRangeLabel(filters.checkIn, filters.checkOut);
  const guestsText = guestsLabel(filters.guests);

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

  const setGuests = (next: number) => {
    onChange({ ...filters, guests: Math.min(16, Math.max(1, next)) });
  };

  const setDates = (checkIn: string, checkOut: string) => {
    let start = checkIn || filters.checkIn;
    let end = checkOut || filters.checkOut;
    if (parseISODate(end) <= parseISODate(start)) {
      const next = parseISODate(start);
      next.setDate(next.getDate() + 1);
      end = toISODate(next);
    }
    onChange({
      ...filters,
      checkIn: start,
      checkOut: end,
      nights: nightsBetween(start, end),
    });
  };

  const setNeighborhood = (slug?: string) => {
    onChange({ ...filters, neighborhood: slug });
    setOpen(null);
  };

  return (
    <Flex
      as="header"
      h={{ base: '64px', md: '72px', lg: '80px' }}
      align="center"
      justify="space-between"
      px={{ base: 4, md: 8, lg: 10 }}
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

      <Box ref={rootRef} position="relative" flex="1" maxW="560px">
        <Flex
          align="center"
          border="1px solid"
          borderColor={open ? 'ink' : 'line'}
          borderRadius="full"
          boxShadow={
            open
              ? '0 4px 18px rgba(0,0,0,.10)'
              : '0 2px 10px rgba(0,0,0,.06)'
          }
          pl={{ base: 2, md: '8px' }}
          pr="6px"
          py="6px"
          fontSize={{ base: '13px', md: '14px' }}
          fontWeight="600"
          gap={0}
          bg="bg"
          transition="border-color .15s ease, box-shadow .15s ease"
        >
          <Segment
            label={locationLabel}
            active={open === 'location'}
            onClick={() =>
              setOpen((prev) => (prev === 'location' ? null : 'location'))
            }
            flex={{ base: 1, sm: '1.2' }}
          />
          <Divider hideBelow="sm" />
          <Segment
            label={datesLabel}
            active={open === 'dates'}
            onClick={() =>
              setOpen((prev) => (prev === 'dates' ? null : 'dates'))
            }
            flex={{ base: 'none', sm: 1 }}
            display={{ base: 'none', sm: 'flex' }}
          />
          <Divider hideBelow="md" />
          <Segment
            label={guestsText}
            muted
            active={open === 'guests'}
            onClick={() =>
              setOpen((prev) => (prev === 'guests' ? null : 'guests'))
            }
            flex={{ base: 'none', md: 0.9 }}
            display={{ base: 'none', md: 'flex' }}
          />
          <Flex
            as="button"
            ml="auto"
            w="38px"
            h="38px"
            borderRadius="full"
            bg="brand.500"
            color="white"
            align="center"
            justify="center"
            flexShrink={0}
            cursor="pointer"
            border="none"
            aria-label="Search stays"
            _hover={{ bg: 'brand.600' }}
            onClick={() =>
              setOpen((prev) => (prev ? null : 'location'))
            }
          >
            <Search size={16} strokeWidth={1.9} />
          </Flex>
        </Flex>

        {open ? (
          <Box
            position="absolute"
            top="calc(100% + 10px)"
            left={{ base: '-8px', sm: 0 }}
            right={{ base: '-8px', sm: 0 }}
            bg="bg"
            border="1px solid"
            borderColor="line"
            borderRadius="22px"
            boxShadow="0 12px 40px rgba(0,0,0,.14)"
            p={{ base: 4, md: 5 }}
            zIndex={50}
          >
            <Flex gap="8px" mb={4} display={{ base: 'flex', md: 'none' }}>
              {(
                [
                  { id: 'location', label: 'Where' },
                  { id: 'dates', label: 'When' },
                  { id: 'guests', label: 'Guests' },
                ] as const
              ).map((tab) => (
                <Flex
                  key={tab.id}
                  as="button"
                  flex="1"
                  justify="center"
                  py="8px"
                  borderRadius="full"
                  fontSize="13px"
                  fontWeight="700"
                  bg={open === tab.id ? 'ink' : 'bg.soft'}
                  color={open === tab.id ? 'white' : 'ink.2'}
                  border="none"
                  cursor="pointer"
                  onClick={() => setOpen(tab.id)}
                >
                  {tab.label}
                </Flex>
              ))}
            </Flex>

            {open === 'location' ? (
              <Box>
                <Text fontSize="12px" fontWeight="700" color="ink.3" mb={3}>
                  Where
                </Text>
                <Flex direction="column" gap="6px">
                  <PlaceOption
                    title="Anywhere in Lagos"
                    subtitle="Browse all Lagos stays"
                    active={!filters.neighborhood}
                    onClick={() => setNeighborhood(undefined)}
                  />
                  {neighborhoods.map((nb) => (
                    <PlaceOption
                      key={nb.id}
                      title={nb.name}
                      subtitle={`${nb.city} · ${nb.property_count} stays`}
                      active={filters.neighborhood === nb.slug}
                      onClick={() => setNeighborhood(nb.slug)}
                    />
                  ))}
                </Flex>
              </Box>
            ) : null}

            {open === 'dates' ? (
              <Box>
                <Text fontSize="12px" fontWeight="700" color="ink.3" mb={3}>
                  When
                </Text>
                <Flex gap={3} direction={{ base: 'column', sm: 'row' }} mb={4}>
                  <DateField
                    label="Check in"
                    value={filters.checkIn}
                    min={DEMO_STAY.checkIn}
                    onChange={(value) => setDates(value, filters.checkOut)}
                  />
                  <DateField
                    label="Check out"
                    value={filters.checkOut}
                    min={filters.checkIn}
                    onChange={(value) => setDates(filters.checkIn, value)}
                  />
                </Flex>
                <Text fontSize="12px" fontWeight="700" color="ink.3" mb={2}>
                  Quick picks
                </Text>
                <Flex gap="8px" flexWrap="wrap">
                  {DATE_PRESETS.map((preset) => {
                    const selected =
                      filters.checkIn === preset.checkIn &&
                      filters.checkOut === preset.checkOut;
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
                          setDates(preset.checkIn, preset.checkOut);
                          setOpen(null);
                        }}
                      >
                        {preset.label}
                      </Flex>
                    );
                  })}
                </Flex>
                <Text color="ink.3" fontSize="13px" mt={3}>
                  {nightsBetween(filters.checkIn, filters.checkOut)} night
                  {nightsBetween(filters.checkIn, filters.checkOut) === 1
                    ? ''
                    : 's'}
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
                  <StepButton
                    ariaLabel="Fewer guests"
                    disabled={filters.guests <= 1}
                    onClick={() => setGuests(filters.guests - 1)}
                  >
                    <Minus size={16} strokeWidth={2} />
                  </StepButton>
                  <Text
                    minW="28px"
                    textAlign="center"
                    fontWeight="700"
                    fontSize="16px"
                  >
                    {filters.guests}
                  </Text>
                  <StepButton
                    ariaLabel="More guests"
                    disabled={filters.guests >= 16}
                    onClick={() => setGuests(filters.guests + 1)}
                  >
                    <Plus size={16} strokeWidth={2} />
                  </StepButton>
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

function Segment({
  label,
  onClick,
  active,
  muted,
  flex,
  display,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  muted?: boolean;
  flex?: object | number | string;
  display?: object | string;
}) {
  return (
    <Flex
      as="button"
      align="center"
      px={{ base: 3, md: '14px' }}
      py="8px"
      borderRadius="full"
      cursor="pointer"
      border="none"
      bg={active ? 'bg.soft' : 'transparent'}
      color={muted && !active ? 'ink.3' : 'ink'}
      flex={flex}
      display={display}
      minW={0}
      textAlign="left"
      _hover={{ bg: 'bg.soft' }}
      onClick={onClick}
    >
      <Text lineClamp={1} w="full">
        {label}
      </Text>
    </Flex>
  );
}

function Divider({ hideBelow }: { hideBelow: 'sm' | 'md' }) {
  return (
    <Box
      w="1px"
      h="22px"
      bg="line"
      flexShrink={0}
      display={{
        base: 'none',
        [hideBelow]: 'block',
      }}
    />
  );
}

function PlaceOption({
  title,
  subtitle,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Flex
      as="button"
      w="full"
      align="flex-start"
      direction="column"
      gap="2px"
      px="14px"
      py="12px"
      borderRadius="14px"
      border="1px solid"
      borderColor={active ? 'ink' : 'transparent'}
      bg={active ? 'bg.soft' : 'transparent'}
      cursor="pointer"
      textAlign="left"
      _hover={{ bg: 'bg.soft' }}
      onClick={onClick}
    >
      <Text fontWeight="700" fontSize="14px">
        {title}
      </Text>
      <Text color="ink.3" fontSize="13px">
        {subtitle}
      </Text>
    </Flex>
  );
}

function DateField({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box flex="1">
      <Text fontSize="12px" fontWeight="700" mb="6px">
        {label}
      </Text>
      <Input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        borderColor="line"
        borderRadius="12px"
        h="44px"
        px="12px"
        fontSize="14px"
        fontWeight="600"
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
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <Flex
      as="button"
      w="36px"
      h="36px"
      borderRadius="full"
      border="1px solid"
      borderColor="line"
      align="center"
      justify="center"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.4 : 1}
      aria-disabled={disabled}
      aria-label={ariaLabel}
      bg="bg"
      _hover={disabled ? undefined : { bg: 'bg.soft' }}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
    >
      {children}
    </Flex>
  );
}
