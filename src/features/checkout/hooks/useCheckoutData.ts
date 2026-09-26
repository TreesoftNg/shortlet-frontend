'use client';

import { getPropertyBySlug } from '@/data/api';
import { properties } from '@/data/mocks';
import type { Property, Unit } from '@/data/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

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

export function useCheckoutProperty(slug: string | null) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => (slug ? getPropertyBySlug(slug) : Promise.resolve(null)),
    initialData: () =>
      slug ? properties.find((p) => p.slug === slug) ?? null : null,
    enabled: Boolean(slug),
  });
}

export function buildCheckoutQuote(
  property: Property,
  unitId: string | null,
): CheckoutQuote {
  const unit =
    property.units.find((u) => u.id === unitId) ?? property.units[0] ?? null;
  const nights = 4;
  const guests = 2;
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
    datesLabel: 'Oct 12 – 16, 2026 · 4 nights',
    checkInShort: 'Mon, Oct 12',
    checkOutShort: 'Fri, Oct 16',
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
