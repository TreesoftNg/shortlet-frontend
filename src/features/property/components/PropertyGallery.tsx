'use client';

import type { PropertyImage } from '@/data/types';
import { Box, Flex, Grid, Portal, Text } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight, Grid3x3, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type PropertyGalleryProps = {
  images: PropertyImage[];
  title: string;
};

function ShowAllPhotosButton({
  total,
  onOpen,
  display,
}: {
  total: number;
  onOpen: () => void;
  display?: Record<string, string>;
}) {
  return (
    <Flex
      as="button"
      position="absolute"
      right="14px"
      bottom="14px"
      display={display}
      align="center"
      gap="8px"
      bg="white"
      color="ink"
      border="1px solid"
      borderColor="ink"
      borderRadius="10px"
      px="14px"
      py="8px"
      fontWeight="700"
      fontSize="13px"
      cursor="pointer"
      zIndex={2}
      boxShadow="sm"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <Grid3x3 size={16} strokeWidth={1.9} />
      <Text as="span">Show all {total} photos</Text>
    </Flex>
  );
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primary = sorted[0];
  const rest = sorted.slice(1, 5);
  const total = sorted.length;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openAt = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, total - 1)));
    setOpen(true);
  };

  const close = () => setOpen(false);

  const goPrev = () =>
    setActiveIndex((i) => (i <= 0 ? total - 1 : i - 1));

  const goNext = () =>
    setActiveIndex((i) => (i >= total - 1 ? 0 : i + 1));

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, total]);

  if (!primary) return null;

  const active = sorted[activeIndex] ?? primary;
  /** ≤2 side photos → one right column; more → 2×2 side grid */
  const stackedSide = rest.length > 0 && rest.length <= 2;
  const lastSideIndex = Math.max(0, rest.length - 1);
  const lastMdVisibleIndex = Math.min(1, lastSideIndex);

  return (
    <Box
      position="relative"
      borderRadius={{ base: '16px', md: '22px' }}
      overflow="hidden"
    >
      {/* Mobile: single hero */}
      <Box
        as="button"
        display={{ base: 'block', md: 'none' }}
        position="relative"
        h="280px"
        w="full"
        p={0}
        border="none"
        cursor="pointer"
        onClick={() => openAt(0)}
      >
        <Image
          src={primary.url}
          alt={primary.alt || title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <Box
          position="absolute"
          right="16px"
          bottom="16px"
          bg="rgba(0,0,0,.6)"
          color="white"
          fontSize="12px"
          fontWeight="600"
          px="10px"
          py="4px"
          borderRadius="8px"
        >
          1 / {total}
        </Box>
      </Box>

      {/* Tablet / desktop grid — columns follow real photo count */}
      <Grid
        display={{ base: 'none', md: 'grid' }}
        templateColumns={
          rest.length === 0
            ? '1fr'
            : {
                md: '1.4fr 1fr',
                lg: stackedSide ? '2fr 1fr' : '2fr 1fr 1fr',
              }
        }
        templateRows={
          rest.length === 0
            ? { md: '400px', lg: '460px' }
            : { md: '200px 200px', lg: '230px 230px' }
        }
        gap="8px"
      >
        <Box
          position="relative"
          gridRow={rest.length === 0 ? 'auto' : 'span 2'}
          overflow="hidden"
        >
          <Box
            as="button"
            position="absolute"
            inset={0}
            p={0}
            border="none"
            cursor="pointer"
            onClick={() => openAt(0)}
          >
            <Image
              src={primary.url}
              alt={primary.alt || title}
              fill
              priority
              sizes="(max-width: 1024px) 60vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
          </Box>
          {rest.length === 0 ? (
            <ShowAllPhotosButton
              total={total}
              display={{ base: 'none', md: 'flex' }}
              onOpen={() => openAt(0)}
            />
          ) : null}
        </Box>
        {rest.map((img, i) => (
          <Box
            key={img.id}
            position="relative"
            display={{
              base: 'none',
              md: i < 2 ? 'block' : 'none',
              lg: 'block',
            }}
            overflow="hidden"
          >
            <Box
              as="button"
              position="absolute"
              inset={0}
              p={0}
              border="none"
              cursor="pointer"
              onClick={() => openAt(i + 1)}
            >
              <Image
                src={img.url}
                alt={img.alt || title}
                fill
                sizes="25vw"
                style={{ objectFit: 'cover' }}
              />
            </Box>
            {i === lastMdVisibleIndex ? (
              <ShowAllPhotosButton
                total={total}
                display={{ base: 'none', md: 'flex', lg: 'none' }}
                onOpen={() => openAt(0)}
              />
            ) : null}
            {i === lastSideIndex ? (
              <ShowAllPhotosButton
                total={total}
                display={{ base: 'none', lg: 'flex' }}
                onOpen={() => openAt(0)}
              />
            ) : null}
          </Box>
        ))}
      </Grid>

      {open ? (
        <Portal>
          <Flex
            position="fixed"
            inset={0}
            zIndex={1400}
            bg="rgba(0,0,0,.92)"
            direction="column"
            role="dialog"
            aria-modal="true"
            aria-label={`Photos of ${title}`}
          >
            <Flex
              align="center"
              justify="space-between"
              px={{ base: 4, md: 6 }}
              py={4}
              color="white"
            >
              <Text fontWeight="700" fontSize="14px">
                {activeIndex + 1} / {total}
              </Text>
              <Flex
                as="button"
                align="center"
                justify="center"
                w="40px"
                h="40px"
                borderRadius="full"
                bg="transparent"
                border="none"
                color="white"
                cursor="pointer"
                aria-label="Close photos"
                onClick={close}
                _hover={{ bg: 'rgba(255,255,255,.15)' }}
              >
                <X size={22} strokeWidth={1.9} />
              </Flex>
            </Flex>

            <Flex flex="1" align="center" justify="center" position="relative" px={4}>
              {total > 1 ? (
                <Flex
                  as="button"
                  position="absolute"
                  left={{ base: 2, md: 6 }}
                  align="center"
                  justify="center"
                  w={{ base: '40px', md: '48px' }}
                  h={{ base: '40px', md: '48px' }}
                  borderRadius="full"
                  bg="rgba(255,255,255,.15)"
                  border="none"
                  color="white"
                  cursor="pointer"
                  aria-label="Previous photo"
                  onClick={goPrev}
                  zIndex={1}
                >
                  <ChevronLeft size={24} strokeWidth={1.9} />
                </Flex>
              ) : null}

              <Box
                position="relative"
                w="full"
                maxW="1100px"
                h={{ base: '55vh', md: '75vh' }}
              >
                <Image
                  src={active.url}
                  alt={active.alt || title}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>

              {total > 1 ? (
                <Flex
                  as="button"
                  position="absolute"
                  right={{ base: 2, md: 6 }}
                  align="center"
                  justify="center"
                  w={{ base: '40px', md: '48px' }}
                  h={{ base: '40px', md: '48px' }}
                  borderRadius="full"
                  bg="rgba(255,255,255,.15)"
                  border="none"
                  color="white"
                  cursor="pointer"
                  aria-label="Next photo"
                  onClick={goNext}
                  zIndex={1}
                >
                  <ChevronRight size={24} strokeWidth={1.9} />
                </Flex>
              ) : null}
            </Flex>

            {total > 1 ? (
              <Flex
                gap="8px"
                px={{ base: 4, md: 6 }}
                py={4}
                overflowX="auto"
                justify="center"
                css={{
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {sorted.map((img, index) => (
                  <Box
                    key={img.id}
                    as="button"
                    position="relative"
                    w="64px"
                    h="48px"
                    flexShrink={0}
                    borderRadius="8px"
                    overflow="hidden"
                    border="2px solid"
                    borderColor={
                      index === activeIndex ? 'white' : 'transparent'
                    }
                    opacity={index === activeIndex ? 1 : 0.65}
                    cursor="pointer"
                    p={0}
                    onClick={() => setActiveIndex(index)}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `${title} thumbnail ${index + 1}`}
                      fill
                      sizes="64px"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Flex>
            ) : null}
          </Flex>
        </Portal>
      ) : null}
    </Box>
  );
}
