'use client';

import type { Neighborhood } from '@/data/types';
import { Box, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

type NeighborhoodTileProps = {
  neighborhood: Neighborhood;
  height?: { base: string; md: string } | string;
};

export function NeighborhoodTile({
  neighborhood,
  height = { base: '180px', md: '220px' },
}: NeighborhoodTileProps) {
  return (
    <Box
      asChild
      position="relative"
      h={height}
      borderRadius="18px"
      overflow="hidden"
    >
      <Link href={`/search?tab=all&neighborhood=${neighborhood.slug}`}>
        {neighborhood.image ? (
          <Image
            src={neighborhood.image}
            alt={neighborhood.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Box position="absolute" inset={0} bg="bg.soft" />
        )}
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(180deg, transparent 35%, rgba(0,0,0,.65))"
        />
        <Box
          position="absolute"
          left="20px"
          bottom="18px"
          color="white"
          zIndex={2}
        >
          <Text fontWeight="800" fontSize={{ base: '18px', md: '22px' }}>
            {neighborhood.name}
          </Text>
          <Text fontSize="14px" mt="2px">
            {neighborhood.property_count} apartments
          </Text>
        </Box>
      </Link>
    </Box>
  );
}
