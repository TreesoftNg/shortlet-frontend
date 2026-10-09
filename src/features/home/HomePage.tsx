'use client';

import { CategoryStrip } from '@/features/home/components/CategoryStrip';
import { FeaturedProperties } from '@/features/home/components/FeaturedProperties';
import { HomeHero } from '@/features/home/components/HomeHero';
import { NeighborhoodGrid } from '@/features/home/components/NeighborhoodGrid';
import { TrustSection } from '@/features/home/components/TrustSection';
import {
  useFeaturedProperties,
  useNeighborhoods,
  useWebsiteContent,
} from '@/features/home/hooks/useHomeData';
import { toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import {
  AppPage,
  EmptyState,
  ErrorState,
  NeighborhoodTileSkeleton,
  PropertyCardSkeletonGrid,
  SectionHeader,
  Skeleton,
  SkeletonText,
} from '@/shared/components';
import { pagePx } from '@/shared/layout';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { Building2, MapPin } from 'lucide-react';
import { useState } from 'react';

export function HomePage() {
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
  const [activeCategory, setActiveCategory] = useState('all');
  const activeTab = toPublicUnitsTab(activeCategory);
  const featuredQuery = useFeaturedProperties(activeCategory);
  const featured = featuredQuery.data ?? [];
  const searchHref =
    activeTab === 'all' ? '/search?tab=all' : `/search?tab=${activeTab}`;

  if (contentPending) {
    return (
      <AppPage wrapMain={false}>
        <HomePageSkeleton />
      </AppPage>
    );
  }

  if (contentError || !content) {
    return (
      <AppPage wrapMain={false}>
        <Box px={pagePx} py={10}>
          <ErrorState
            title="Couldn’t load the homepage"
            description="Please check your connection and try again."
            onRetry={() => {
              void refetchContent();
            }}
            mt={0}
          />
        </Box>
      </AppPage>
    );
  }

  return (
    <AppPage wrapMain={false}>
      <HomeHero
        headline={content.hero.headline}
        subheadline={content.hero.subheadline}
        image={content.hero.image}
      />

      <CategoryStrip
        categories={content.categories}
        activeId={activeCategory}
        onSelect={setActiveCategory}
      />

      <Box as="main" px={pagePx} pb={{ base: 6, md: 8, lg: '20px' }}>
        {featuredQuery.isPending ? (
          <Box mt="44px">
            <SectionHeader
              title="Featured apartments"
              subtitle="Handpicked stays our guests love"
            />
            <PropertyCardSkeletonGrid count={4} />
          </Box>
        ) : featuredQuery.isError ? (
          <ErrorState
            title="Couldn’t load featured apartments"
            description="Featured stays are temporarily unavailable."
            onRetry={() => {
              void featuredQuery.refetch();
            }}
            compact
          />
        ) : featured.length === 0 ? (
          <EmptyState
            title="No featured apartments yet"
            description="Check back soon, or browse all available stays."
            actionLabel="Explore stays"
            actionHref={searchHref}
            icon={<Building2 size={22} strokeWidth={1.9} />}
          />
        ) : (
          <FeaturedProperties
            properties={featured}
            viewAllTab={activeTab}
          />
        )}

        {neighborhoodsPending ? (
          <Box mt={{ base: 10, md: '52px' }}>
            <SectionHeader
              title="Explore by neighbourhood"
              subtitle="Find the right base for work, rest or a weekend away"
            />
            <Grid
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={{ base: 3, md: 4, lg: '20px' }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <NeighborhoodTileSkeleton key={i} />
              ))}
            </Grid>
          </Box>
        ) : neighborhoodsError ? (
          <ErrorState
            title="Couldn’t load neighbourhoods"
            description="Area guides are temporarily unavailable."
            onRetry={() => {
              void refetchNeighborhoods();
            }}
            compact
          />
        ) : neighborhoods.length === 0 ? (
          <EmptyState
            title="No neighbourhoods listed"
            description="We’re adding more areas soon."
            icon={<MapPin size={22} strokeWidth={1.9} />}
          />
        ) : (
          <NeighborhoodGrid neighborhoods={neighborhoods} />
        )}
      </Box>

      <TrustSection
        title={content.trust.title}
        subtitle={content.trust.subtitle}
        items={content.trust.items}
      />
    </AppPage>
  );
}

function HomePageSkeleton() {
  return (
    <Box px={pagePx} pb={10} aria-busy="true">
      <Skeleton
        h={{ base: '120px', md: '420px', lg: '560px' }}
        borderRadius={{ base: 'full', md: '28px' }}
        mt={{ base: 3, md: 6 }}
        mb={6}
      />
      <Flex gap="10px" overflow="hidden" mb={8}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} h="40px" w="110px" borderRadius="full" />
        ))}
      </Flex>
      <Skeleton h="28px" w="240px" mb={3} borderRadius="full" />
      <SkeletonText lines={1} lastWidth="180px" />
      <Box mt={6}>
        <PropertyCardSkeletonGrid count={4} />
      </Box>
    </Box>
  );
}
