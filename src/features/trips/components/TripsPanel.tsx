'use client';

import { PastTripsGrid } from '@/features/trips/components/PastTripsGrid';
import { TripsTabs } from '@/features/trips/components/TripsTabs';
import { UpcomingTripCard } from '@/features/trips/components/UpcomingTripCard';
import {
  useBookingCounts,
  useBookings,
} from '@/features/trips/hooks/useTripsData';
import { EmptyState, ErrorState, Skeleton, SkeletonText } from '@/shared/components';
import type { TripTab } from '@/data/types';
import { Box } from '@chakra-ui/react';
import { CalendarDays, Plane } from 'lucide-react';
import { useState } from 'react';

export function TripsPanel() {
  const [tab, setTab] = useState<TripTab>('upcoming');
  const {
    data: counts = { upcoming: 0, past: 0, cancelled: 0 },
    isPending: countsPending,
    isError: countsError,
    refetch: refetchCounts,
  } = useBookingCounts();
  const {
    data: list = [],
    isPending: listPending,
    isError: listError,
    refetch: refetchList,
  } = useBookings(tab);

  const upcoming = tab === 'upcoming' ? list[0] : null;
  const gridBookings = tab === 'upcoming' ? [] : list;
  const isPending = countsPending || listPending;
  const isError = countsError || listError;

  return (
    <>
      {countsPending ? (
        <Box my={{ base: 4, md: '22px' }}>
          <Skeleton h="40px" w={{ base: '100%', md: '360px' }} borderRadius="full" />
        </Box>
      ) : countsError ? (
        <ErrorState
          title="Couldn’t load trips"
          description="Your bookings are temporarily unavailable."
          onRetry={() => {
            void refetchCounts();
            void refetchList();
          }}
          compact
          mt={4}
        />
      ) : (
        <TripsTabs active={tab} counts={counts} onChange={setTab} />
      )}

      {isError && !countsError ? (
        <ErrorState
          title="Couldn’t load this list"
          description="Try again, or switch to another tab."
          onRetry={() => {
            void refetchList();
          }}
          compact
        />
      ) : isPending ? (
        <TripsPanelSkeleton tab={tab} />
      ) : tab === 'upcoming' ? (
        <>
          {upcoming ? (
            <UpcomingTripCard booking={upcoming} />
          ) : (
            <EmptyState
              title="No upcoming trips"
              description="Ready for your next stay? Explore apartments across Lagos and Abuja."
              actionLabel="Explore stays"
              actionHref="/search"
              icon={<Plane size={22} strokeWidth={1.9} />}
              compact
              mt={2}
            />
          )}
          <PastPreview onViewAll={() => setTab('past')} />
        </>
      ) : (
        <PastTripsGrid
          bookings={gridBookings}
          title={tab === 'past' ? "Where you've been" : 'Cancelled trips'}
          showViewAll={false}
          emptyTitle={
            tab === 'past' ? 'No past trips yet' : 'No cancelled trips'
          }
          emptyDescription={
            tab === 'past'
              ? 'Completed stays will show up here.'
              : 'Cancelled bookings will appear in this list.'
          }
        />
      )}
    </>
  );
}

function PastPreview({ onViewAll }: { onViewAll: () => void }) {
  const {
    data: past = [],
    isPending,
    isError,
    refetch,
  } = useBookings('past');

  if (isPending) {
    return (
      <Box mt={{ base: 8, md: '52px' }}>
        <Skeleton h="24px" w="180px" mb="20px" borderRadius="full" />
        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap="22px"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i}>
              <Skeleton h="180px" borderRadius="lg" mb="12px" />
              <SkeletonText lines={2} lastWidth="50%" />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn’t load past trips"
        onRetry={() => {
          void refetch();
        }}
        compact
      />
    );
  }

  if (!past.length) {
    return (
      <EmptyState
        title="No past trips yet"
        description="When you complete a stay, it will show up here."
        icon={<CalendarDays size={22} strokeWidth={1.9} />}
        compact
      />
    );
  }

  return (
    <PastTripsGrid
      bookings={past.slice(0, 3)}
      title="Where you've been"
      showViewAll
      onViewAll={onViewAll}
    />
  );
}

function TripsPanelSkeleton({ tab }: { tab: TripTab }) {
  if (tab === 'upcoming') {
    return (
      <Box aria-busy="true">
        <Skeleton h={{ base: '280px', md: '220px' }} borderRadius="22px" mb={6} />
        <Skeleton h="24px" w="180px" mb="20px" borderRadius="full" />
        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap="22px"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i}>
              <Skeleton h="180px" borderRadius="lg" mb="12px" />
              <SkeletonText lines={2} lastWidth="50%" />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box mt={4} aria-busy="true">
      <Skeleton h="24px" w="180px" mb="20px" borderRadius="full" />
      <Box
        display="grid"
        gridTemplateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap="22px"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i}>
            <Skeleton h="180px" borderRadius="lg" mb="12px" />
            <SkeletonText lines={2} lastWidth="50%" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
