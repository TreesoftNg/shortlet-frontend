'use client';

import { PastTripsGrid } from '@/features/trips/components/PastTripsGrid';
import { SecureGuestAccountCard } from '@/features/trips/components/SecureGuestAccountCard';
import { TripsTabs } from '@/features/trips/components/TripsTabs';
import { UpcomingTripCard } from '@/features/trips/components/UpcomingTripCard';
import {
  useBookingCounts,
  useBookings,
} from '@/features/trips/hooks/useTripsData';
import { ApiError } from '@/data/api/http';
import { hasGuestBookingSession } from '@/data/lib/booking-session';
import { ensureAccessToken } from '@/features/auth/lib/refresh-session';
import {
  isAuthApiError,
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { EmptyState, ErrorState, Skeleton, SkeletonText } from '@/shared/components';
import type { TripTab } from '@/data/types';
import { Box } from '@chakra-ui/react';
import { Plane } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function TripsPanel({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useIsAuthenticated();
  const [guestSession, setGuestSession] = useState(false);
  const [tab, setTab] = useState<TripTab>('upcoming');
  const {
    data: counts = { upcoming: 0, past: 0, cancelled: 0 },
    isPending: countsPending,
    isError: countsError,
    error: countsErr,
    refetch: refetchCounts,
  } = useBookingCounts();
  const {
    data: list = [],
    isPending: listPending,
    isError: listError,
    error: listErr,
    refetch: refetchList,
  } = useBookings(tab);

  useEffect(() => {
    setGuestSession(hasGuestBookingSession());
  }, [list.length, counts.upcoming]);

  useEffect(() => {
    const err = countsErr ?? listErr;
    if (!err || !isAuthApiError(err)) return;
    // Guest booking-token trips can 401 without a customer session — stay put.
    if (!isAuthenticated && hasGuestBookingSession()) return;
    void ensureAccessToken()
      .then((token) => {
        if (token) {
          void refetchCounts();
          void refetchList();
          return;
        }
        logout();
        router.replace('/auth');
      })
      .catch(() => {
        logout();
        router.replace('/auth');
      });
  }, [
    countsErr,
    listErr,
    logout,
    refetchCounts,
    refetchList,
    router,
    isAuthenticated,
  ]);

  const canViewTrips = isAuthenticated || guestSession;

  if (!canViewTrips && !embedded) {
    return (
      <EmptyState
        title="Sign in to see your trips"
        description="Your confirmed, past and cancelled bookings will appear here."
        actionLabel="Sign in"
        actionHref="/auth"
        icon={<Plane size={22} strokeWidth={1.9} />}
        compact
        mt={4}
      />
    );
  }

  if (!canViewTrips && embedded) {
    return null;
  }

  const isPending = countsPending || listPending;
  const isError = countsError || listError;
  const loadError = countsErr ?? listErr;
  const errorDescription =
    loadError instanceof ApiError
      ? loadError.message
      : 'Your bookings are temporarily unavailable.';

  if (isError) {
    if (isAuthApiError(loadError)) {
      return (
        <EmptyState
          title="Sign in to see your trips"
          description="Your session expired. Sign in again to load your bookings."
          actionLabel="Sign in"
          actionHref="/auth"
          icon={<Plane size={22} strokeWidth={1.9} />}
          compact
          mt={4}
        />
      );
    }

    return (
      <ErrorState
        title="Couldn’t load trips"
        description={errorDescription}
        onRetry={() => {
          void refetchCounts();
          void refetchList();
        }}
        compact
        mt={4}
      />
    );
  }

  return (
    <>
      {!isAuthenticated && guestSession ? (
        <SecureGuestAccountCard
          onSecured={() => {
            setGuestSession(false);
            void refetchCounts();
            void refetchList();
          }}
        />
      ) : null}

      {countsPending ? (
        <Box my={{ base: 4, md: '22px' }}>
          <Skeleton h="40px" w={{ base: '100%', md: '360px' }} borderRadius="full" />
        </Box>
      ) : (
        <TripsTabs active={tab} counts={counts} onChange={setTab} />
      )}

      {isPending ? (
        <TripsPanelSkeleton tab={tab} />
      ) : tab === 'upcoming' ? (
        <>
          {list.length === 0 ? (
            <EmptyState
              title="No upcoming trips"
              description="Ready for your next stay? Explore apartments across Lagos and Abuja."
              actionLabel="Explore stays"
              actionHref="/search"
              icon={<Plane size={22} strokeWidth={1.9} />}
              compact
              mt={2}
            />
          ) : (
            <Box display="flex" flexDirection="column" gap={{ base: 4, md: 5 }}>
              {list.map((booking) => (
                <UpcomingTripCard key={booking.id} booking={booking} />
              ))}
            </Box>
          )}
          <PastPreview onViewAll={() => setTab('past')} />
        </>
      ) : (
        <PastTripsGrid
          bookings={list}
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

  // Keep the Upcoming tab clean — only preview past stays when some exist.
  if (!past.length) return null;

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
