'use client';

import { useNeighborhoods } from '@/features/home/hooks/useHomeData';
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { SiteFooter } from '@/shared/components/SiteFooter';
import { SiteHeader } from '@/shared/components/SiteHeader';
import { pagePx } from '@/shared/layout';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

export function LocationsPage() {
  const { data: neighborhoods = [] } = useNeighborhoods();

  const lagos = neighborhoods.filter((n) => n.city === 'Lagos');
  const abuja = neighborhoods.filter((n) => n.city === 'Abuja');

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <SiteHeader />

      <Box
        as="main"
        px={pagePx}
        pt={{ base: 8, md: 12 }}
        pb={{ base: '40px', md: 12 }}
      >
        <Box maxW="720px" mb={{ base: 8, md: 10 }}>
          <Text
            fontSize="13px"
            fontWeight="700"
            color="brand.500"
            textTransform="uppercase"
            letterSpacing="0.06em"
          >
            Destinations
          </Text>
          <Heading
            as="h1"
            mt="10px"
            fontSize={{ base: '32px', md: '42px' }}
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1.15"
          >
            Locations
          </Heading>
          <Text color="ink.2" fontSize={{ base: '15px', md: '16px' }} mt="14px">
            Browse Sunmade neighbourhoods across Lagos and Abuja, then jump into
            available apartments in each area.
          </Text>
        </Box>

        <CitySection title="Lagos" areas={lagos} />
        <CitySection title="Abuja" areas={abuja} mt={{ base: 10, md: 12 }} />

        <Flex
          mt={{ base: 10, md: 12 }}
          direction={{ base: 'column', sm: 'row' }}
          align={{ sm: 'center' }}
          justify="space-between"
          gap={4}
          bg="bg.soft"
          borderRadius="20px"
          p={{ base: 6, md: 8 }}
        >
          <Box>
            <Text fontWeight="800" fontSize="20px" letterSpacing="-0.01em">
              Looking for something specific?
            </Text>
            <Text color="ink.2" fontSize="14px" mt="4px">
              Use search filters for dates, guests, and amenities.
            </Text>
          </Box>
          <Flex
            asChild
            h="48px"
            px="22px"
            align="center"
            justify="center"
            borderRadius="12px"
            bg="brand.500"
            color="white"
            fontWeight="700"
            fontSize="15px"
            _hover={{ bg: 'brand.600' }}
          >
            <Link href="/search">Open search</Link>
          </Flex>
        </Flex>
      </Box>

      <SiteFooter />
      <MobileTabBar />
    </Box>
  );
}

function CitySection({
  title,
  areas,
  mt,
}: {
  title: string;
  areas: {
    id: string;
    name: string;
    slug: string;
    image: string;
    property_count: number;
  }[];
  mt?: { base: number; md: number };
}) {
  if (!areas.length) return null;

  return (
    <Box mt={mt}>
      <Heading
        as="h2"
        fontSize={{ base: '22px', md: '26px' }}
        fontWeight="700"
        letterSpacing="-0.01em"
        mb="18px"
      >
        {title}
      </Heading>
      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={{ base: 3, md: 4 }}
      >
        {areas.map((area) => (
          <Box
            key={area.id}
            asChild
            position="relative"
            h={{ base: '200px', md: '240px' }}
            borderRadius="18px"
            overflow="hidden"
          >
            <Link href={`/search?neighborhood=${area.slug}`}>
              <Image
                src={area.image}
                alt={area.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
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
                <Text fontWeight="800" fontSize="22px">
                  {area.name}
                </Text>
                <Text fontSize="14px" mt="2px">
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
