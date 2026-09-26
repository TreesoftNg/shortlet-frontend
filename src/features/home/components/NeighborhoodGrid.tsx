'use client';

import { sectionMt } from '@/shared/layout';
import type { Neighborhood } from '@/data/types';
import { Box, Grid, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

type NeighborhoodGridProps = {
  neighborhoods: Neighborhood[];
};

export function NeighborhoodGrid({ neighborhoods }: NeighborhoodGridProps) {
  return (
    <Box>
      <Box mb={{ base: 4, md: '22px' }} mt={sectionMt}>
        <Heading
          as="h2"
          fontSize={{ base: '20px', md: '22px' }}
          fontWeight="700"
          letterSpacing="-0.01em"
        >
          Explore by neighbourhood
        </Heading>
        <Text color="ink.2" fontSize={{ base: '13px', md: '14px' }}>
          Find the right base for work, rest or a weekend away
        </Text>
      </Box>

      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={{ base: 3, md: 4, lg: '20px' }}
      >
        {neighborhoods.map((area) => (
          <Box
            key={area.id}
            asChild
            position="relative"
            h={{ base: '180px', md: '200px', lg: '220px' }}
            borderRadius="lg"
            overflow="hidden"
          >
            <Link href={`/search?neighborhood=${area.slug}`}>
              <Image
                src={area.image}
                alt={area.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              <Box
                position="absolute"
                inset={0}
                bg="linear-gradient(180deg, transparent 40%, rgba(0,0,0,.6))"
              />
              <Box
                position="absolute"
                left={{ base: 4, md: '20px' }}
                bottom={{ base: 4, md: '18px' }}
                color="white"
                zIndex={2}
              >
                <Text
                  as="b"
                  fontSize={{ base: '18px', md: '20px' }}
                  display="block"
                  fontWeight="700"
                >
                  {area.name}
                </Text>
                <Text fontSize={{ base: '13px', md: '14px' }}>
                  {area.property_count} apartments
                </Text>
              </Box>
            </Link>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
