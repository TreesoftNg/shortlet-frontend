'use client';

import { useWebsiteContent } from '@/features/home/hooks/useHomeData';
import { TrustSection } from '@/features/home/components/TrustSection';
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { SiteFooter } from '@/shared/components/SiteFooter';
import { SiteHeader } from '@/shared/components/SiteHeader';
import { pagePx } from '@/shared/layout';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

const story = [
  'Sunmade Apartments & Suites is a shortlet brand built for guests who want verified, fully furnished apartments across Lagos and Abuja — without the guesswork of unverified listings.',
  'Every stay is inspected, professionally cleaned, and supported round the clock. Book in minutes, check in with confidence, and settle into a space that feels like home.',
];

const cities = [
  {
    name: 'Lagos',
    blurb: 'Lekki, Victoria Island, Ikoyi and more — close to work, nightlife and the waterfront.',
    image:
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80',
  },
  {
    name: 'Abuja',
    blurb: 'Calm, well-connected stays in Maitama and across the capital for business or leisure.',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
  },
];

export function AboutPage() {
  const { data: content } = useWebsiteContent();

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <SiteHeader />

      <Box as="main" pb={{ base: '40px', md: 0 }}>
        <Box px={pagePx} pt={{ base: 8, md: 12 }} maxW="780px">
          <Text
            fontSize="13px"
            fontWeight="700"
            color="brand.500"
            textTransform="uppercase"
            letterSpacing="0.06em"
          >
            Our story
          </Text>
          <Heading
            as="h1"
            mt="10px"
            fontSize={{ base: '32px', md: '42px' }}
            fontWeight="800"
            letterSpacing="-0.03em"
            lineHeight="1.15"
          >
            Shortlets that feel like home
          </Heading>
          <Text color="ink.2" fontSize={{ base: '15px', md: '16px' }} mt="14px">
            {content?.hero.subheadline}
          </Text>
        </Box>

        <Box
          position="relative"
          mx={pagePx}
          mt={{ base: 8, md: 10 }}
          h={{ base: '220px', md: '360px' }}
          borderRadius={{ base: '20px', md: '28px' }}
          overflow="hidden"
        >
          <Image
            src={
              content?.hero.image ??
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80'
            }
            alt="Sunmade apartment interior"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>

        <Box px={pagePx} mt={{ base: 8, md: 10 }} maxW="780px">
          {story.map((paragraph) => (
            <Text
              key={paragraph.slice(0, 24)}
              color="ink.2"
              fontSize={{ base: '15px', md: '16px' }}
              mb="16px"
              lineHeight="1.7"
            >
              {paragraph}
            </Text>
          ))}
        </Box>

        <Box px={pagePx} mt={{ base: 8, md: 10 }}>
          <Heading
            as="h2"
            fontSize={{ base: '22px', md: '26px' }}
            fontWeight="700"
            letterSpacing="-0.01em"
            mb="18px"
          >
            Where we operate
          </Heading>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap={{ base: 4, md: 5 }}
          >
            {cities.map((city) => (
              <Box
                key={city.name}
                asChild
                borderRadius="18px"
                overflow="hidden"
                border="1px solid"
                borderColor="line"
              >
                <Link href="/locations">
                  <Box position="relative" h="180px">
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                  <Box p="18px 20px">
                    <Text fontWeight="800" fontSize="18px">
                      {city.name}
                    </Text>
                    <Text color="ink.2" fontSize="14px" mt="6px">
                      {city.blurb}
                    </Text>
                  </Box>
                </Link>
              </Box>
            ))}
          </Grid>
        </Box>

        {content ? (
          <TrustSection
            title={content.trust.title}
            subtitle={content.trust.subtitle}
            items={content.trust.items}
          />
        ) : null}

        <Flex
          mx={pagePx}
          mb={{ base: 10, md: 12 }}
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
              Ready to book your next stay?
            </Text>
            <Text color="ink.2" fontSize="14px" mt="4px">
              Browse verified apartments across Lagos & Abuja.
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
            <Link href="/search">Explore stays</Link>
          </Flex>
        </Flex>
      </Box>

      <SiteFooter />
      <MobileTabBar />
    </Box>
  );
}
