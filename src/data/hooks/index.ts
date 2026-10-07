'use client';

/**
 * Shared React Query hooks — the only place that should call `src/data/api`.
 * Features import from here (or thin feature re-exports) so query keys and
 * options stay consistent.
 */

import {
  createBooking,
  createCustomerReview,
  getBookings,
  getNeighborhoodBySlug,
  getNeighborhoods,
  getProperties,
  getPublicUnitById,
  getPublicUnits,
  getReviewsByPropertyId,
  getUnitQuote,
  getWebsiteContent,
  verifyBookingPayment,
  type CreateBookingInput,
  type CreateReviewInput,
  type PropertyListParams,
  type PublicUnitsParams,
} from '@/data/api';
import { DEMO_STAY } from '@/data/demo-stay';
import { bookingTab, toMoneyNumber } from '@/data/lib/map-booking';
import { toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import { queryKeys } from '@/data/query-keys';
import type { BookingQuote as ApiBookingQuote } from '@/data/types';
import type { Property, TripTab, Unit } from '@/data/types';
import { isAccessTokenExpired } from '@/features/auth/lib/access-token';
import {
  invalidateAuthSession,
  isAuthApiError,
  useAuthStore,
} from '@/features/auth/store/auth-store';
import { getDefaultStay } from '@/shared/lib/default-stay';
import {
  formatDatesRangeLabel,
  parseISODate,
} from '@/shared/lib/format';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';

/** Shared query defaults for list/detail reads. */
const readOptions = {
  staleTime: 60_000,
} as const;

// ── Content ───────────────────────────────────────────────────────────────

export function useWebsiteContent() {
  return useQuery({
    queryKey: queryKeys.content.website(),
    queryFn: getWebsiteContent,
    ...readOptions,
  });
}

// ── Neighborhoods ─────────────────────────────────────────────────────────

export function useNeighborhoods() {
  return useQuery({
    queryKey: queryKeys.neighborhoods.list(),
    queryFn: getNeighborhoods,
    ...readOptions,
  });
}

export function useNeighborhood(slug?: string) {
  return useQuery({
    queryKey: queryKeys.neighborhoods.detail(slug ?? ''),
    queryFn: () =>
      slug ? getNeighborhoodBySlug(slug) : Promise.resolve(null),
    enabled: Boolean(slug),
    ...readOptions,
  });
}

// ── Public units (live browse API) ────────────────────────────────────────

export function usePublicUnits(params: PublicUnitsParams = {}) {
  const normalised: PublicUnitsParams = {
    ...params,
    tab: toPublicUnitsTab(params.tab),
  };
  return useQuery({
    queryKey: queryKeys.publicUnits.list(normalised),
    queryFn: () => getPublicUnits(normalised),
    placeholderData: keepPreviousData,
    ...readOptions,
  });
}

// ── Properties ────────────────────────────────────────────────────────────

/** Featured strip on home — powered by GET /api/v1/public/units?tab=… */
export function useFeaturedProperties(categoryOrTab = 'all') {
  const tab = toPublicUnitsTab(categoryOrTab);
  return useQuery({
    queryKey: queryKeys.properties.featured(tab),
    queryFn: async () => {
      const page = await getPublicUnits({ tab, limit: 4 });
      return page.items;
    },
    ...readOptions,
  });
}

export function useProperties(params: PropertyListParams = {}) {
  return useQuery({
    queryKey: queryKeys.properties.list(params),
    queryFn: () => getProperties(params),
    ...readOptions,
  });
}

/** Full public unit detail (property + reviews) from one API response. */
export function usePublicUnitDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => getPublicUnitById(id),
    enabled: Boolean(id),
    ...readOptions,
  });
}

/** Property-only view of the public unit detail (shared cache with usePublicUnitDetail). */
export function useProperty(slug: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(slug),
    queryFn: () => getPublicUnitById(slug),
    select: (result) => result?.property ?? null,
    enabled: Boolean(slug),
    ...readOptions,
  });
}

// ── Reviews ───────────────────────────────────────────────────────────────

export function usePropertyReviews(propertyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reviews.byProperty(propertyId ?? ''),
    queryFn: () =>
      propertyId
        ? getReviewsByPropertyId(propertyId)
        : Promise.resolve([]),
    enabled: Boolean(propertyId),
    ...readOptions,
  });
}

/** POST /api/v1/reviews — submit a customer review for a completed booking. */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) => {
      const accessToken = useAuthStore.getState().getValidAccessToken();
      if (!accessToken) {
        throw new Error('Sign in to leave a review.');
      }
      return createCustomerReview(input, accessToken);
    },
    onSuccess: (review) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      if (review.unitId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.reviews.byProperty(review.unitId),
        });
        void queryClient.invalidateQueries({
          queryKey: queryKeys.properties.detail(review.unitId),
        });
      }
    },
  });
}

// ── Bookings ──────────────────────────────────────────────────────────────

function useValidAccessToken() {
  return useAuthStore((s) => {
    if (!s.accessToken) return null;
    if (isAccessTokenExpired(s.accessToken, s.accessTokenExpiresAt)) {
      return null;
    }
    return s.accessToken;
  });
}

function useAllBookingsQuery() {
  const accessToken = useValidAccessToken();
  return useQuery({
    queryKey: [...queryKeys.bookings.list('all'), accessToken ?? 'anon'],
    queryFn: () => getBookings(undefined, accessToken),
    enabled: Boolean(accessToken),
    ...readOptions,
  });
}

export function useBookings(tab?: TripTab) {
  const query = useAllBookingsQuery();
  const list = !tab
    ? (query.data ?? [])
    : (query.data ?? []).filter((booking) => bookingTab(booking) === tab);

  return {
    ...query,
    data: list,
  };
}

export function useBookingCounts() {
  const query = useAllBookingsQuery();
  const list = query.data ?? [];
  const counts = {
    upcoming: list.filter((booking) => bookingTab(booking) === 'upcoming')
      .length,
    past: list.filter((booking) => bookingTab(booking) === 'past').length,
    cancelled: list.filter((booking) => bookingTab(booking) === 'cancelled')
      .length,
  };

  return {
    ...query,
    data: counts,
  };
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      const token = useAuthStore.getState().getValidAccessToken();
      if (!token) {
        return createBooking(input, null);
      }
      try {
        return await createBooking(input, token);
      } catch (error) {
        if (!isAuthApiError(error)) throw error;
        // Stale Bearer breaks guest checkout — drop session and retry unsigned.
        invalidateAuthSession();
        return createBooking(input, null);
      }
    },
  });
}

export function useVerifyBookingPayment() {
  return useMutation({
    mutationFn: (args: {
      bookingId: string;
      transactionId?: string;
      bookingToken?: string | null;
    }) => {
      const accessToken = useAuthStore.getState().getValidAccessToken();
      return verifyBookingPayment(
        args.bookingId,
        { transactionId: args.transactionId },
        { accessToken, bookingToken: args.bookingToken },
      );
    },
  });
}

// ── Checkout quote (live API quote + property card) ───────────────────────

export type PaymentMethod = 'card' | 'transfer' | 'ussd';

export type CheckoutQuote = {
  property: Property;
  unit: Unit | null;
  nights: number;
  guests: number;
  nightly: number;
  stay: number;
  cleaning: number;
  service: number;
  tax: number;
  deposit: number;
  total: number;
  datesLabel: string;
  checkIn: string;
  checkOut: string;
  checkInShort: string;
  checkOutShort: string;
  houseRules: string | null;
  apiQuote: ApiBookingQuote | null;
};

function shortStayLabel(iso: string) {
  return parseISODate(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function buildCheckoutQuoteFromApi(
  property: Property,
  unitId: string | null,
  apiQuote: ApiBookingQuote,
): CheckoutQuote {
  const unit =
    property.units.find((u) => u.id === unitId) ?? property.units[0] ?? null;
  const stay = toMoneyNumber(apiQuote.price.nightsSubtotal);
  const nights = apiQuote.nights || 1;
  const cleaning = toMoneyNumber(apiQuote.price.cleaningFee);
  const service = toMoneyNumber(apiQuote.price.serviceFee?.amount);
  const tax = toMoneyNumber(apiQuote.price.tax?.amount);
  const deposit = toMoneyNumber(apiQuote.deposit.amount);
  const total = toMoneyNumber(apiQuote.totalDueNow);
  const nightly = nights > 0 ? stay / nights : toMoneyNumber(unit?.nightly_rate);

  return {
    property,
    unit,
    nights,
    guests: apiQuote.guests.adults + apiQuote.guests.children,
    nightly,
    stay,
    cleaning,
    service,
    tax,
    deposit,
    total,
    datesLabel: formatDatesRangeLabel(apiQuote.checkIn, apiQuote.checkOut),
    checkIn: apiQuote.checkIn,
    checkOut: apiQuote.checkOut,
    checkInShort: shortStayLabel(apiQuote.checkIn),
    checkOutShort: shortStayLabel(apiQuote.checkOut),
    houseRules: apiQuote.houseRules ?? null,
    apiQuote,
  };
}

/** Offline/demo fallback used by unit tests. */
export function buildCheckoutQuote(
  property: Property,
  unitId: string | null,
): CheckoutQuote {
  const unit =
    property.units.find((u) => u.id === unitId) ?? property.units[0] ?? null;
  const nights = DEMO_STAY.nights;
  const guests = DEMO_STAY.guests;
  const nightly = unit?.nightly_rate ?? property.pricing.nightly_rate;
  const stay = nightly * nights;
  const cleaning = property.pricing.cleaning_fee;
  const service = property.pricing.service_fee;
  const deposit = property.pricing.caution_deposit;

  return {
    property,
    unit,
    nights,
    guests,
    nightly,
    stay,
    cleaning,
    service,
    tax: 0,
    deposit,
    total: stay + cleaning + service + deposit,
    datesLabel: DEMO_STAY.datesLabel,
    checkIn: DEMO_STAY.checkIn,
    checkOut: DEMO_STAY.checkOut,
    checkInShort: DEMO_STAY.checkInShort,
    checkOutShort: DEMO_STAY.checkOutShort,
    houseRules: null,
    apiQuote: null,
  };
}

export type UnitQuoteParams = {
  unitId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
};

export function useUnitQuote(params: UnitQuoteParams | null) {
  return useQuery({
    queryKey: queryKeys.quotes.unit(
      params ?? { unitId: '', checkIn: '', checkOut: '', adults: 0 },
    ),
    queryFn: () =>
      getUnitQuote({
        unitId: params!.unitId,
        checkIn: params!.checkIn,
        checkOut: params!.checkOut,
        adults: params!.adults,
      }),
    enabled: Boolean(
      params?.unitId && params.checkIn && params.checkOut && params.adults > 0,
    ),
    placeholderData: keepPreviousData,
    ...readOptions,
  });
}

export function useCheckoutQuote(
  property: Property | null | undefined,
  unitId: string | null,
  stay?: { checkIn: string; checkOut: string; guests: number } | null,
) {
  const resolvedUnitId =
    unitId || property?.units[0]?.id || property?.id || '';
  const defaults = getDefaultStay();
  const checkIn = stay?.checkIn ?? defaults.checkIn;
  const checkOut = stay?.checkOut ?? defaults.checkOut;
  const adults = stay?.guests ?? defaults.guests;

  const quoteQuery = useUnitQuote(
    property && resolvedUnitId
      ? { unitId: resolvedUnitId, checkIn, checkOut, adults }
      : null,
  );

  return useMemo(() => {
    if (!property) return { quote: null, ...quoteQuery };
    if (quoteQuery.data) {
      return {
        quote: buildCheckoutQuoteFromApi(property, unitId, quoteQuery.data),
        ...quoteQuery,
      };
    }
    return {
      quote: null,
      ...quoteQuery,
    };
  }, [property, unitId, quoteQuery]);
}
