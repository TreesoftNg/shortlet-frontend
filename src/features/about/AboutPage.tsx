'use client';

import { useWebsiteContent } from '@/features/home/hooks/useHomeData';
import { TrustSection } from '@/features/home/components/TrustSection';
import {
  AppButton,
  AppPage,
  ErrorState,
  PageHero,
  Skeleton,
  SkeletonText,
  Surface,
} from '@/shared/components';
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
    blurb:
      'Lekki, Victoria Island, Ikoyi and more — close to work, nightlife and the waterfront.',
    image:
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80',
  },
  {
    name: 'Abuja',
    blurb:
      'Calm, well-connected stays in Maitama and across the capital for business or leisure.',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80',
  },
];

export function AboutPage() {
  const {
    data: content,
    isPending,
    isError,
    refetch,
  } = useWebsiteContent();

  return (
    <AppPage wrapMain={false}>
      <Box as="main" pb={{ base: '40px', md: 0 }}>
        <Box px={pagePx} pt={{ base: 8, md: 12 }}>
          <PageHero
            eyebrow="Our story"
            title="Shortlets that feel like home"
            description={content?.hero.subheadline}
            maxW="780px"
            mb={0}
          />
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
              <Surface key={city.name} radius="lg" asChild>
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
              </Surface>
            ))}
          </Grid>
        </Box>

        {isPending ? (
          <Box px={pagePx} py={10} aria-busy="true">
            <Skeleton h="28px" w="200px" mb={3} borderRadius="full" />
            <SkeletonText lines={2} lastWidth="40%" />
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={4}
              mt={8}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} h="140px" borderRadius="lg" />
              ))}
            </Grid>
          </Box>
        ) : isError ? (
          <Box px={pagePx}>
            <ErrorState
              title="Couldn’t load brand details"
              description="Trust highlights are temporarily unavailable."
              onRetry={() => {
                void refetch();
              }}
              compact
            />
          </Box>
        ) : content ? (
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
          <AppButton href="/search">Explore stays</AppButton>
        </Flex>
      </Box>
    </AppPage>
  );
}
