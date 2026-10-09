'use client';

import { TrustSection } from '@/features/home/components/TrustSection';
import { useNeighborhoods, useWebsiteContent } from '@/features/home/hooks/useHomeData';
import {
  AppButton,
  AppPage,
  EmptyState,
  ErrorState,
  NeighborhoodTile,
  NeighborhoodTileSkeleton,
  PageHero,
  Skeleton,
  SkeletonText,
} from '@/shared/components';
import { pagePx } from '@/shared/layout';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

const story = [
  'Sunmade Apartments & Suites is a shortlet brand built for guests who want verified, fully furnished apartments — without the guesswork of unverified listings.',
  'Every stay is inspected, professionally cleaned, and supported round the clock. Book in minutes, check in with confidence, and settle into a space that feels like home.',
];

export function AboutPage() {
  const {
    data: content,
    isPending: contentPending,
    isError: contentError,
    refetch: refetchContent,
  } = useWebsiteContent();
  const {
    data: neighborhoods = [],
    isPending: neighborhoodsPending,
    isError: neighborhoodsError,
    refetch: refetchNeighborhoods,
  } = useNeighborhoods();

  const locationsPending = neighborhoodsPending;
  const locationsError = neighborhoodsError;

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
          bg="bg.soft"
        >
          {contentPending ? (
            <Box position="absolute" inset={0}>
              <Skeleton h="100%" borderRadius="inherit" />
            </Box>
          ) : content?.hero.image ? (
            <Image
              src={content.hero.image}
              alt="Sunmade apartment interior"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : null}
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

          {locationsPending ? (
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={{ base: 4, md: 5 }}
              aria-busy="true"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <NeighborhoodTileSkeleton
                  key={i}
                  height={{ base: '180px', md: '200px' }}
                />
              ))}
            </Grid>
          ) : locationsError ? (
            <ErrorState
              title="Couldn’t load locations"
              description="Neighbourhoods are temporarily unavailable."
              onRetry={() => {
                void refetchNeighborhoods();
              }}
              compact
            />
          ) : neighborhoods.length === 0 ? (
            <EmptyState
              title="No locations yet"
              description="We’re adding Sunmade neighbourhoods soon."
              actionLabel="Open search"
              actionHref="/search"
              icon={<MapPin size={22} strokeWidth={1.9} />}
            />
          ) : (
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={{ base: 4, md: 5 }}
            >
              {neighborhoods.map((area) => (
                <NeighborhoodTile
                  key={area.id}
                  neighborhood={area}
                  height={{ base: '180px', md: '200px' }}
                />
              ))}
            </Grid>
          )}
        </Box>

        {contentPending ? (
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
        ) : contentError ? (
          <Box px={pagePx}>
            <ErrorState
              title="Couldn’t load brand details"
              description="Trust highlights are temporarily unavailable."
              onRetry={() => {
                void refetchContent();
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
              Browse verified apartments in our live neighbourhoods.
            </Text>
          </Box>
          <AppButton href="/search">Explore stays</AppButton>
        </Flex>
      </Box>
    </AppPage>
  );
}
