'use client';

import { PastTripsGrid } from '@/features/trips/components/PastTripsGrid';
import { TripsTabs } from '@/features/trips/components/TripsTabs';
import { UpcomingTripCard } from '@/features/trips/components/UpcomingTripCard';
import {
  useBookingCounts,
  useBookings,
} from '@/features/trips/hooks/useTripsData';
import { AppPage, PageHero } from '@/shared/components';
import type { TripTab } from '@/data/types';
import { Text } from '@chakra-ui/react';
import { useState } from 'react';

export function TripsPage() {
  const [tab, setTab] = useState<TripTab>('upcoming');
  const { data: counts = { upcoming: 0, past: 0, cancelled: 0 } } =
    useBookingCounts();
  const { data: list = [] } = useBookings(tab);

  const upcoming = tab === 'upcoming' ? list[0] : null;
  const gridBookings = tab === 'upcoming' ? [] : list;

  return (
    <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
      <PageHero title="Trips" size="app" mb={0} maxW="none" />

      <TripsTabs active={tab} counts={counts} onChange={setTab} />

      {tab === 'upcoming' ? (
        <>
          {upcoming ? (
            <UpcomingTripCard booking={upcoming} />
          ) : (
            <Text color="ink.2">
              No upcoming trips. Ready for your next stay?
            </Text>
          )}
          <PastPreview />
        </>
      ) : (
        <PastTripsGrid
          bookings={gridBookings}
          title={tab === 'past' ? "Where you've been" : 'Cancelled trips'}
          showViewAll={tab === 'past'}
        />
      )}
    </AppPage>
  );
}

function PastPreview() {
  const { data: past = [] } = useBookings('past');
  return (
    <PastTripsGrid
      bookings={past.slice(0, 3)}
      title="Where you've been"
      showViewAll
    />
  );
}
