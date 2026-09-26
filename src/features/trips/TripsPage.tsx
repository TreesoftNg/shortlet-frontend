'use client';

import { PastTripsGrid } from '@/features/trips/components/PastTripsGrid';
import { TripsHeader } from '@/features/trips/components/TripsHeader';
import { TripsTabs } from '@/features/trips/components/TripsTabs';
import { UpcomingTripCard } from '@/features/trips/components/UpcomingTripCard';
import {
  useBookingCounts,
  useBookings,
} from '@/features/trips/hooks/useTripsData';
import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { pagePx } from '@/shared/layout';
import type { TripTab } from '@/data/types';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';

export function TripsPage() {
  const [tab, setTab] = useState<TripTab>('upcoming');
  const { data: counts } = useBookingCounts();
  const { data: list = [] } = useBookings(tab);

  const upcoming = tab === 'upcoming' ? list[0] : null;
  const gridBookings =
    tab === 'upcoming'
      ? [] // past preview shown separately below
      : list;

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <TripsHeader />

      <Box
        as="main"
        px={pagePx}
        pb={{ base: '100px', md: '80px' }}
      >
        <Heading
          as="h1"
          mt={{ base: 6, md: '44px' }}
          fontSize={{ base: '28px', md: '34px' }}
          fontWeight="800"
          letterSpacing="-0.02em"
        >
          Trips
        </Heading>

        <TripsTabs
          active={tab}
          counts={counts}
          onChange={setTab}
        />

        {tab === 'upcoming' ? (
          <>
            {upcoming ? (
              <UpcomingTripCard booking={upcoming} />
            ) : (
              <Text color="ink.2">No upcoming trips. Ready for your next stay?</Text>
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
      </Box>

      <MobileTabBar />
    </Box>
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
