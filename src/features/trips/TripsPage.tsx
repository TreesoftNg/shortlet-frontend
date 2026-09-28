'use client';

import { TripsPanel } from '@/features/trips/components/TripsPanel';
import { AppPage, PageHero } from '@/shared/components';

export function TripsPage() {
  return (
    <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
      <PageHero title="Trips" size="app" mb={0} maxW="none" />
      <TripsPanel />
    </AppPage>
  );
}
