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
import { AppPage } from '@/shared/components';
import { pagePx } from '@/shared/layout';
import { Box, Text } from '@chakra-ui/react';
import { useMemo, useState } from 'react';

export function HomePage() {
  const { data: content, isPending: contentPending } = useWebsiteContent();
  const { data: neighborhoods = [] } = useNeighborhoods();
  const featuredQuery = useFeaturedProperties();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFeatured = useMemo(() => {
    const list = featuredQuery.data ?? [];
    if (activeCategory === 'all') return list;
    return list.filter((p) => p.tags?.includes(activeCategory));
  }, [featuredQuery.data, activeCategory]);

  if (contentPending || !content) {
    return (
      <AppPage wrapMain={false}>
        <Box px={pagePx} py={10}>
          <Text color="ink.2">Loading…</Text>
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
    </AppPage>
  );
}
