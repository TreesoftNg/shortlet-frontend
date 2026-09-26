'use client';

import { PropertyCard } from '@/shared/components/PropertyCard';
import { sectionMt } from '@/shared/layout';
import type { Property } from '@/data/types';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type FeaturedPropertiesProps = {
  properties: Property[];
};

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <Box>
      <Flex
        align={{ base: 'start', sm: 'end' }}
        justify="space-between"
        gap={3}
        mb={{ base: 4, md: '22px' }}
        mt={sectionMt}
      >
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: '20px', md: '22px' }}
            fontWeight="700"
            letterSpacing="-0.01em"
          >
            Featured apartments
          </Heading>
          <Text color="ink.2" fontSize={{ base: '13px', md: '14px' }}>
            Handpicked stays our guests love
          </Text>
        </Box>
        <Flex
          asChild
          align="center"
          gap="8px"
          h={{ base: 'auto', sm: '38px' }}
          px={{ base: 0, sm: '14px' }}
          fontSize={{ base: '13px', sm: '13px' }}
          fontWeight="700"
          borderRadius="10px"
          borderWidth={{ base: 0, sm: '1px' }}
          borderColor="ink"
          bg={{ base: 'transparent', sm: 'white' }}
          color="ink"
          flexShrink={0}
        >
          <Link href="/search">
            View all <ArrowRight size={16} strokeWidth={1.9} />
          </Link>
        </Flex>
      </Flex>

      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)',
        }}
        gap={{ base: 5, md: 6, lg: '26px' }}
      >
        {properties.slice(0, 4).map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            initiallySaved={index === 1}
          />
        ))}
      </Grid>
    </Box>
  );
}
