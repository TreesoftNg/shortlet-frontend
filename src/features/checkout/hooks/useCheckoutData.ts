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
import { useAuthStore } from '@/features/auth/store/auth-store';
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
  return useMemo(
    () => ({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: '',
      username: user?.username ?? '',
      isSignedIn: Boolean(user),
    }),
    [user],
  );
}
