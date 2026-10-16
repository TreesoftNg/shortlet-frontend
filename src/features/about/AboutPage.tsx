'use client';

import { TrustSection } from '@/features/home/components/TrustSection';
import {
  // useNeighborhoods,
  useWebsiteContent,
} from '@/features/home/hooks/useHomeData';
import {
  AppButton,
  AppPage,
  ErrorState,
  PageHero,
  Skeleton,
  SkeletonText,
} from '@/shared/components';
import { pagePx } from '@/shared/layout';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';

const story = [
  'Sunmade Luxury Shortlets & Suites is a shortlet brand built for guests who want a verified, fully furnished stay — without the guesswork of unverified listings.',
  'Every stay is inspected, professionally cleaned, and supported round the clock. Book in minutes, check in with confidence, and settle into a space that feels like home.',
];

export function AboutPage() {
  const {
    data: content,
    isPending: contentPending,
    isError: contentError,
    refetch: refetchContent,
  } = useWebsiteContent();

  return (
    <AppPage wrapMain={false}>
      <Box as="main" pb={{ base: '40px', md: 0 }}>
        <Box px={pagePx} pt={{ base: 8, md: 12 }} mb={{ base: 8, md: 10 }}>
          <PageHero
            eyebrow="Our story"
            title="Shortlets that feel like home"
            description={content?.hero.subheadline}
            maxW="640px"
            mb={0}
          />
        </Box>

        <Grid
          px={pagePx}
          templateColumns={{ base: '1fr', lg: '1.15fr 1fr' }}
          gap={{ base: 6, md: 8, lg: '48px' }}
          alignItems="center"
          maxW="1440px"
          mx="auto"
        >
          <Box
            position="relative"
            h={{ base: '240px', md: '380px', lg: '440px' }}
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
                sizes="(max-width: 1024px) 100vw, 55vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : null}
          </Box>

          <Box>
            <Heading
              as="h2"
              fontSize={{ base: '20px', md: '24px' }}
              fontWeight="700"
              letterSpacing="-0.01em"
              mb="18px"
            >
              Built for confident stays
            </Heading>
            {story.map((paragraph) => (
              <Text
                key={paragraph.slice(0, 24)}
                color="ink.2"
                fontSize={{ base: '15px', md: '16px' }}
                mb="14px"
                lineHeight="1.7"
                _last={{ mb: 0 }}
              >
                {paragraph}
              </Text>
            ))}
          </Box>
        </Grid>

        {/* Where we operate (neighbourhoods) temporarily disabled */}

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
              Browse our verified, fully furnished apartment.
            </Text>
          </Box>
          <AppButton href="/search?tab=all">Explore stays</AppButton>
        </Flex>
      </Box>
    </AppPage>
  );
}
