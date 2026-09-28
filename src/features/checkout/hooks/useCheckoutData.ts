'use client';

import {
  buildCheckoutQuote,
  mockGuest,
  useCheckoutQuote,
  useProperty,
  type CheckoutQuote,
  type PaymentMethod,
} from '@/data/hooks';

export {
  buildCheckoutQuote,
  mockGuest,
  useCheckoutQuote,
  type CheckoutQuote,
  type PaymentMethod,
};

/** Checkout loads the same property detail query as the property page. */
export function useCheckoutProperty(slug: string | null) {
  return useProperty(slug ?? '');
}
