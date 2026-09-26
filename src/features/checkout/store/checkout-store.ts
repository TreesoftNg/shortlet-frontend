import { create } from 'zustand';
import type { PaymentMethod } from '@/features/checkout/hooks/useCheckoutData';

type CheckoutState = {
  paymentMethod: PaymentMethod;
  purpose: string;
  holdSeconds: number;
  setPaymentMethod: (method: PaymentMethod) => void;
  setPurpose: (purpose: string) => void;
  tickHold: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  paymentMethod: 'card',
  purpose: '',
  holdSeconds: 14 * 60 + 52,
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setPurpose: (purpose) => set({ purpose }),
  tickHold: () =>
    set((s) => ({ holdSeconds: Math.max(0, s.holdSeconds - 1) })),
}));
