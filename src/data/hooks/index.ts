'use client';

/**
 * Shared React Query hooks — the only place that should call `src/data/api`.
 * Features import from here (or thin feature re-exports) so query keys and
 * options stay consistent.
 */

import {
  getBookingCounts,
  getBookings,
  getNeighborhoodBySlug,
  getNeighborhoods,
  getProperties,
  getPublicUnitById,
  getPublicUnits,
  getReviewsByPropertyId,
  getWebsiteContent,
  type PropertyListParams,
  type PublicUnitsParams,
} from '@/data/api';
import { DEMO_STAY } from '@/data/demo-stay';
import { toPublicUnitsTab } from '@/data/lib/public-unit-tabs';
import { queryKeys } from '@/data/query-keys';
import type { Property, TripTab, Unit } from '@/data/types';
import { useQuery } from '@tanstack/react-query';
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
    ...readOptions,
  });
}

// ── Properties ────────────────────────────────────────────────────────────

/** Featured strip on home — powered by GET /api/v1/public/units?tab=… */
export function useFeaturedProperties(categoryOrTab = 'all') {
  const tab = toPublicUnitsTab(categoryOrTab);
  return useQuery({
    queryKey: queryKeys.properties.featured(tab),
    queryFn: () => getPublicUnits({ tab, limit: 4 }),
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

// ── Bookings ──────────────────────────────────────────────────────────────

export function useBookings(tab?: TripTab) {
  const keyTab = tab ?? 'all';
  return useQuery({
    queryKey: queryKeys.bookings.list(keyTab),
    queryFn: () => getBookings(tab),
    ...readOptions,
  });
}

export function useBookingCounts() {
  return useQuery({
    queryKey: queryKeys.bookings.counts(),
    queryFn: getBookingCounts,
    ...readOptions,
  });
}

// ── Checkout quote (derived client-side from property + demo stay) ────────

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
  deposit: number;
  total: number;
  datesLabel: string;
  checkInShort: string;
  checkOutShort: string;
};

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
    deposit,
    total: stay + cleaning + service + deposit,
    datesLabel: DEMO_STAY.datesLabel,
    checkInShort: DEMO_STAY.checkInShort,
    checkOutShort: DEMO_STAY.checkOutShort,
  };
}

export function useCheckoutQuote(
  property: Property | null | undefined,
  unitId: string | null,
) {
  return useMemo(() => {
    if (!property) return null;
    return buildCheckoutQuote(property, unitId);
  }, [property, unitId]);
}

export const mockGuest = {
  firstName: 'Temitope',
  lastName: 'Aladesiun',
  email: 'temi@example.com',
  phone: '+234 801 234 5678',
  username: 'aladesiun.t',
};
