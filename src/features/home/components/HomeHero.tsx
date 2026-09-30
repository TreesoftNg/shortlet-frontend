'use client';

import { useNeighborhoods } from '@/data/hooks';
import { DEMO_STAY } from '@/data/demo-stay';
import { pagePx } from '@/shared/layout';
import {
  guestsLabel,
  parseISODate,
  toISODate,
} from '@/shared/lib/format';
import { tokens } from '@/shared/theme/tokens';
import { Box, Button, Flex, Grid, Heading, Input, Text } from '@chakra-ui/react';
import { Minus, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

type HomeHeroProps = {
  headline: string;
  subheadline: string;
  image: string;
};

type SearchField = 'where' | 'checkIn' | 'checkOut' | 'guests';

type StayDraft = {
  neighborhood?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

function shortDateLabel(iso: string) {
  return parseISODate(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function buildSearchHref(draft: StayDraft) {
  const params = new URLSearchParams();
  if (draft.neighborhood) params.set('neighborhood', draft.neighborhood);
  if (draft.checkIn) params.set('checkIn', draft.checkIn);
  if (draft.checkOut) params.set('checkOut', draft.checkOut);
  if (draft.guests) params.set('guests', String(draft.guests));
  const query = params.toString();
  return query ? `/search?${query}` : '/search';
}

export function HomeHero({ headline, subheadline, image }: HomeHeroProps) {
  const router = useRouter();
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const { data: neighborhoods = [] } = useNeighborhoods();

  const [draft, setDraft] = useState<StayDraft>({
    checkIn: DEMO_STAY.checkIn,
    checkOut: DEMO_STAY.checkOut,
    guests: DEMO_STAY.guests,
  });
  const [open, setOpen] = useState<SearchField | null>(null);
  const [datesTouched, setDatesTouched] = useState(false);
  const [guestsTouched, setGuestsTouched] = useState(false);

  const locationLabel = useMemo(() => {
    if (!draft.neighborhood) return null;
    const match = neighborhoods.find((n) => n.slug === draft.neighborhood);
    return match?.name ?? draft.neighborhood;
  }, [draft.neighborhood, neighborhoods]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideMobile = mobileRef.current?.contains(target);
      const insideDesktop = desktopRef.current?.contains(target);
      if (!insideMobile && !insideDesktop) setOpen(null);
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

  const applyDates = (checkIn: string, checkOut: string) => {
    let start = checkIn || draft.checkIn;
    let end = checkOut || draft.checkOut;
    if (parseISODate(end) <= parseISODate(start)) {
      const bumped = parseISODate(start);
      bumped.setDate(bumped.getDate() + 1);
      end = toISODate(bumped);
    }
    setDatesTouched(true);
    setDraft((prev) => ({ ...prev, checkIn: start, checkOut: end }));
  };

  const goSearch = () => {
    setOpen(null);
    router.push(buildSearchHref(draft));
  };

  const summaryLine = [
    locationLabel ?? 'Anywhere',
    datesTouched
      ? `${shortDateLabel(draft.checkIn)} – ${shortDateLabel(draft.checkOut)}`
      : 'Any week',
    guestsTouched ? guestsLabel(draft.guests) : 'Add guests',
  ].join(' · ');

  return (
    <>
      {/* Mobile / tablet compact search */}
      <Box
        display={{ base: 'block', lg: 'none' }}
        px={pagePx}
        pt={{ base: 3, md: 4 }}
        pb={2}
        position="relative"
        zIndex={5}
        ref={mobileRef}
      >
        <Flex
          as="button"
          w="full"
          align="center"
          gap="12px"
          px="16px"
          py="12px"
          borderRadius="full"
          border="1px solid"
          borderColor={open ? 'ink' : 'line'}
          bg="white"
          boxShadow="0 3px 14px rgba(0,0,0,.12)"
          cursor="pointer"
          textAlign="left"
          onClick={() =>
            setOpen((prev) => (prev ? null : 'where'))
          }
        >
          <Search size={18} strokeWidth={1.9} color={tokens.colors.brand[500]} />
          <Box minW={0}>
            <Text fontSize="14px" fontWeight="700" color="ink">
              {locationLabel ?? 'Where to?'}
            </Text>
            <Text fontSize="12px" color="ink.3" lineClamp={1}>
              {summaryLine}
            </Text>
          </Box>
        </Flex>

        {open ? (
          <SearchPanel
            open={open}
            setOpen={setOpen}
            draft={draft}
            setDraft={setDraft}
            neighborhoods={neighborhoods}
            applyDates={applyDates}
            setGuestsTouched={setGuestsTouched}
            onSearch={goSearch}
            mobile
          />
        ) : null}
      </Box>

      {/* Desktop / large tablet hero */}
      <Box
        position="relative"
        display={{ base: 'none', md: 'block' }}
        mx={pagePx}
        mt={{ md: 4, lg: 6 }}
        h={{ md: '420px', lg: '560px' }}
        borderRadius={{ md: '22px', lg: '28px' }}
        overflow="visible"
      >
        <Box
          position="absolute"
          inset={0}
          borderRadius={{ md: '22px', lg: '28px' }}
          overflow="hidden"
        >
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1440px"
            style={{ objectFit: 'cover' }}
          />
          <Box
            position="absolute"
            inset={0}
            bg="linear-gradient(90deg, rgba(0,0,0,.55), rgba(0,0,0,.1) 60%), linear-gradient(180deg, transparent 50%, rgba(0,0,0,.35))"
          />
        </Box>

        <Box
          position="absolute"
          left={{ md: 8, lg: '64px' }}
          bottom={{ md: '120px', lg: '150px' }}
          zIndex={2}
          color="white"
          maxW={{ md: '480px', lg: '640px' }}
          pr={4}
        >
          <Heading
            as="h1"
            fontSize={{ md: '40px', lg: '56px' }}
            lineHeight="1.05"
            fontWeight="800"
            letterSpacing="-0.03em"
          >
            {headline}
          </Heading>
          <Text fontSize={{ md: '16px', lg: '18px' }} mt="14px" opacity={0.92}>
            {subheadline}
          </Text>
        </Box>

        <Box
          position="absolute"
          zIndex={3}
          left={{ md: 6, lg: '64px' }}
          right={{ md: 6, lg: '64px' }}
          bottom={{ md: 6, lg: '40px' }}
          ref={desktopRef}
        >
          <Grid
            bg="white"
            borderRadius="full"
            boxShadow="lg"
            templateColumns={{
              md: '1.4fr auto',
              lg: '1.5fr 1fr 1fr 1fr auto',
            }}
            alignItems="center"
            p={{ md: 2, lg: '8px 8px 8px 12px' }}
            gap={{ md: 2, lg: 0 }}
            border="1px solid"
            borderColor={open ? 'ink' : 'transparent'}
          >
            <FieldButton
              label="Where"
              value={locationLabel ?? 'Lekki, Victoria Island, Ikoyi…'}
              placeholder={!locationLabel}
              active={open === 'where'}
              onClick={() =>
                setOpen((prev) => (prev === 'where' ? null : 'where'))
              }
              showDivider
            />
            <FieldButton
              label="Check in"
              value={
                datesTouched ? shortDateLabel(draft.checkIn) : 'Add dates'
              }
              placeholder={!datesTouched}
              active={open === 'checkIn'}
              onClick={() =>
                setOpen((prev) => (prev === 'checkIn' ? null : 'checkIn'))
              }
              showDivider
              hideBelowLg
            />
            <FieldButton
              label="Check out"
              value={
                datesTouched ? shortDateLabel(draft.checkOut) : 'Add dates'
              }
              placeholder={!datesTouched}
              active={open === 'checkOut'}
              onClick={() =>
                setOpen((prev) => (prev === 'checkOut' ? null : 'checkOut'))
              }
              showDivider
              hideBelowLg
            />
            <FieldButton
              label="Guests"
              value={
                guestsTouched ? guestsLabel(draft.guests) : 'Add guests'
              }
              placeholder={!guestsTouched}
              active={open === 'guests'}
              onClick={() =>
                setOpen((prev) => (prev === 'guests' ? null : 'guests'))
              }
              hideBelowLg
            />

            <Button
              h={{ md: '48px', lg: '60px' }}
              px={{ md: 5, lg: '28px' }}
              borderRadius="full"
              bg="brand.500"
              color="white"
              fontWeight="700"
              gap="10px"
              flexShrink={0}
              _hover={{ bg: 'brand.600' }}
              onClick={goSearch}
            >
              <Search size={20} strokeWidth={1.9} />
              <Text as="span" display={{ base: 'none', sm: 'inline' }}>
                Search
              </Text>
            </Button>
          </Grid>

          {open ? (
            <SearchPanel
              open={open}
              setOpen={setOpen}
              draft={draft}
              setDraft={setDraft}
              neighborhoods={neighborhoods}
              applyDates={applyDates}
              setGuestsTouched={setGuestsTouched}
              onSearch={goSearch}
            />
          ) : null}
        </Box>
      </Box>
    </>
  );
}

function FieldButton({
  label,
  value,
  placeholder,
  active,
  onClick,
  showDivider,
  hideBelowLg,
}: {
  label: string;
  value: string;
  placeholder?: boolean;
  active?: boolean;
  onClick: () => void;
  showDivider?: boolean;
  hideBelowLg?: boolean;
}) {
  return (
    <Box
      as="button"
      textAlign="left"
      cursor="pointer"
      px={{ md: 4, lg: '26px' }}
      py={{ md: 2, lg: '10px' }}
      borderRadius="full"
      border="none"
      bg={active ? 'bg.soft' : 'transparent'}
      borderRightWidth={{
        md: 0,
        lg: showDivider ? '1px' : 0,
      }}
      borderColor="line"
      display={
        hideBelowLg
          ? { md: 'none', lg: 'block' }
          : 'block'
      }
      _hover={{ bg: 'bg.soft' }}
      onClick={onClick}
    >
      <Text fontSize="12px" fontWeight="700">
        {label}
      </Text>
      <Text
        fontSize="14px"
        color={placeholder ? 'ink.3' : 'ink'}
        fontWeight={placeholder ? '500' : '600'}
        lineClamp={1}
      >
        {value}
      </Text>
    </Box>
  );
}

function SearchPanel({
  open,
  setOpen,
  draft,
  setDraft,
  neighborhoods,
  applyDates,
  setGuestsTouched,
  onSearch,
  mobile,
}: {
  open: SearchField;
  setOpen: (field: SearchField | null) => void;
  draft: StayDraft;
  setDraft: React.Dispatch<React.SetStateAction<StayDraft>>;
  neighborhoods: { id: string; name: string; slug: string; city: string; property_count: number }[];
  applyDates: (checkIn: string, checkOut: string) => void;
  setGuestsTouched: (value: boolean) => void;
  onSearch: () => void;
  mobile?: boolean;
}) {
  return (
    <Box
      position="absolute"
      top={mobile ? 'calc(100% + 10px)' : 'calc(100% + 12px)'}
      left={0}
      right={mobile ? 0 : undefined}
      w={mobile ? 'auto' : { md: '100%', lg: '420px' }}
      bg="bg"
      border="1px solid"
      borderColor="line"
      borderRadius="22px"
      boxShadow="0 12px 40px rgba(0,0,0,.14)"
      p={{ base: 4, md: 5 }}
      zIndex={20}
    >
      {mobile ? (
        <Flex gap="8px" mb={4}>
          {(
            [
              { id: 'where', label: 'Where' },
              { id: 'checkIn', label: 'Dates' },
              { id: 'guests', label: 'Guests' },
            ] as const
          ).map((tab) => {
            const active =
              tab.id === 'checkIn'
                ? open === 'checkIn' || open === 'checkOut'
                : open === tab.id;
            return (
              <Flex
                key={tab.id}
                as="button"
                flex="1"
                justify="center"
                py="8px"
                borderRadius="full"
                fontSize="13px"
                fontWeight="700"
                bg={active ? 'ink' : 'bg.soft'}
                color={active ? 'white' : 'ink.2'}
                border="none"
                cursor="pointer"
                onClick={() => setOpen(tab.id)}
              >
                {tab.label}
              </Flex>
            );
          })}
        </Flex>
      ) : null}

      {open === 'where' ? (
        <Box>
          <Text fontSize="12px" fontWeight="700" color="ink.3" mb={3}>
            Where
          </Text>
          <Flex direction="column" gap="6px">
            <PlaceOption
              title="Anywhere"
              subtitle="Browse all Sunmade stays"
              active={!draft.neighborhood}
              onClick={() => {
                setDraft((prev) => ({ ...prev, neighborhood: undefined }));
                setOpen(null);
              }}
            />
            {neighborhoods.map((nb) => (
              <PlaceOption
                key={nb.id}
                title={nb.name}
                subtitle={`${nb.city} · ${nb.property_count} stays`}
                active={draft.neighborhood === nb.slug}
                onClick={() => {
                  setDraft((prev) => ({ ...prev, neighborhood: nb.slug }));
                  setOpen(null);
                }}
              />
            ))}
          </Flex>
        </Box>
      ) : null}

      {open === 'checkIn' || open === 'checkOut' ? (
        <Box>
          <Text fontSize="12px" fontWeight="700" color="ink.3" mb={3}>
            When
          </Text>
          <Flex gap={3} direction={{ base: 'column', sm: 'row' }} mb={4}>
            <Box flex="1">
              <Text fontSize="12px" fontWeight="700" mb="6px">
                Check in
              </Text>
              <Input
                type="date"
                value={draft.checkIn}
                min={DEMO_STAY.checkIn}
                onChange={(e) => applyDates(e.target.value, draft.checkOut)}
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
                value={draft.checkOut}
                min={draft.checkIn}
                onChange={(e) => applyDates(draft.checkIn, e.target.value)}
                borderColor="line"
                borderRadius="12px"
                h="44px"
                px="12px"
                fontSize="14px"
                fontWeight="600"
              />
            </Box>
          </Flex>
          <Button
            w="full"
            h="44px"
            borderRadius="full"
            bg="brand.500"
            color="white"
            fontWeight="700"
            _hover={{ bg: 'brand.600' }}
            onClick={() => {
              setOpen(null);
            }}
          >
            Done
          </Button>
        </Box>
      ) : null}

      {open === 'guests' ? (
        <Box>
          <Flex align="center" justify="space-between" gap={4} mb={4}>
            <Box>
              <Text fontWeight="700">Guests</Text>
              <Text color="ink.3" fontSize="13px" mt="2px">
                Ages 13 or above
              </Text>
            </Box>
            <Flex align="center" gap="14px">
              <StepButton
                ariaLabel="Fewer guests"
                disabled={draft.guests <= 1}
                onClick={() => {
                  setGuestsTouched(true);
                  setDraft((prev) => ({
                    ...prev,
                    guests: Math.max(1, prev.guests - 1),
                  }));
                }}
              >
                <Minus size={16} strokeWidth={2} />
              </StepButton>
              <Text minW="28px" textAlign="center" fontWeight="700">
                {draft.guests}
              </Text>
              <StepButton
                ariaLabel="More guests"
                disabled={draft.guests >= 16}
                onClick={() => {
                  setGuestsTouched(true);
                  setDraft((prev) => ({
                    ...prev,
                    guests: Math.min(16, prev.guests + 1),
                  }));
                }}
              >
                <Plus size={16} strokeWidth={2} />
              </StepButton>
            </Flex>
          </Flex>
          <Button
            w="full"
            h="44px"
            borderRadius="full"
            bg="brand.500"
            color="white"
            fontWeight="700"
            gap="8px"
            _hover={{ bg: 'brand.600' }}
            onClick={onSearch}
          >
            <Search size={16} strokeWidth={1.9} />
            Search
          </Button>
        </Box>
      ) : null}
    </Box>
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
