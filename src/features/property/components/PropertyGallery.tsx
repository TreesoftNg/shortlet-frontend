'use client';

import type { PropertyImage } from '@/data/types';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { Grid3x3 } from 'lucide-react';
import Image from 'next/image';

type PropertyGalleryProps = {
  images: PropertyImage[];
  title: string;
};

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primary = sorted[0];
  const rest = sorted.slice(1, 5);
  const totalLabel = Math.max(sorted.length, 24);

  if (!primary) return null;

  return (
    <Box
      position="relative"
      borderRadius={{ base: '16px', md: '22px' }}
      overflow="hidden"
    >
      {/* Mobile: single hero */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="relative"
        h="280px"
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
          1 / {totalLabel}
        </Box>
      </Box>

      {/* Tablet / desktop grid */}
      <Grid
        display={{ base: 'none', md: 'grid' }}
        templateColumns={{ md: '1.4fr 1fr', lg: '2fr 1fr 1fr' }}
        templateRows={{ md: '200px 200px', lg: '230px 230px' }}
        gap="8px"
      >
        <Box
          position="relative"
          gridRow="span 2"
          gridColumn={{ md: '1', lg: '1' }}
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
        {rest.map((img, i) => (
          <Box
            key={img.id}
            position="relative"
            display={{
              base: 'none',
              md: i < 2 ? 'block' : 'none',
              lg: 'block',
            }}
          >
            <Image
              src={img.url}
              alt={img.alt || title}
              fill
              sizes="25vw"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        ))}
        {/* Fill empty slots if fewer images */}
        {Array.from({ length: Math.max(0, 4 - rest.length) }).map((_, i) => (
          <Box
            key={`empty-${i}`}
            bg="bg.soft"
            display={{
              base: 'none',
              md: rest.length + i < 2 ? 'block' : 'none',
              lg: 'block',
            }}
          />
        ))}
      </Grid>

      <Flex
        as="button"
        position="absolute"
        right={{ base: 4, md: '22px' }}
        bottom={{ base: 4, md: '22px' }}
        display={{ base: 'none', md: 'flex' }}
        align="center"
        gap="8px"
        bg="white"
        border="1px solid"
        borderColor="ink"
        borderRadius="10px"
        px="14px"
        py="8px"
        fontWeight="700"
        fontSize="13px"
        cursor="pointer"
      >
        <Grid3x3 size={16} strokeWidth={1.9} />
        <Text as="span">Show all {totalLabel} photos</Text>
      </Flex>
    </Box>
  );
}
