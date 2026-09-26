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
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { SiteFooter } from '@/shared/components/SiteFooter';
import { SiteHeader } from '@/shared/components/SiteHeader';
import { pagePx } from '@/shared/layout';
import { Box, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

export function HomePage() {
  const { data: content } = useWebsiteContent();
  const { data: neighborhoods } = useNeighborhoods();
  const featuredQuery = useFeaturedProperties();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFeatured = useMemo(() => {
    const list = featuredQuery.data ?? [];
    if (activeCategory === 'all') return list;
    return list.filter((p) => p.tags?.includes(activeCategory));
  }, [featuredQuery.data, activeCategory]);

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <SiteHeader />

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
        {featuredQuery.isError ? (
          <Text color="danger" mt="44px">
            Could not load featured apartments.
          </Text>
        ) : (
          <FeaturedProperties properties={filteredFeatured} />
        )}

        <NeighborhoodGrid neighborhoods={neighborhoods} />
      </Box>

      <TrustSection
        title={content.trust.title}
        subtitle={content.trust.subtitle}
        items={content.trust.items}
      />

      <SiteFooter />
      <MobileTabBar />
    </Box>
  );
}
