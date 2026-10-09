'use client';

import {
  buildCheckoutQuote,
  useCheckoutQuote,
  useCreateBooking,
  useProperty,
  useVerifyBookingPayment,
  type CheckoutQuote,
  type PaymentMethod,
} from '@/data/hooks';
import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { useMemo } from 'react';

export {
  buildCheckoutQuote,
  useCheckoutQuote,
  useCreateBooking,
  useVerifyBookingPayment,
  type CheckoutQuote,
  type PaymentMethod,
};

/** Checkout loads the same property detail query as the property page. */
export function useCheckoutProperty(slug: string | null) {
  return useProperty(slug ?? '');
}

/** Prefill guest fields from the signed-in customer when available. */
export function useCheckoutGuest() {
  const user = useAuthStore((s) => s.user);
  const isSignedIn = useIsAuthenticated();
  return useMemo(
    () => ({
      firstName: isSignedIn ? (user?.firstName ?? '') : '',
      lastName: isSignedIn ? (user?.lastName ?? '') : '',
      email: isSignedIn ? (user?.email ?? '') : '',
      phone: '',
      username: isSignedIn ? (user?.username ?? '') : '',
      isSignedIn,
    }),
    [isSignedIn, user],
  );
}