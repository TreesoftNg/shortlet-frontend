'use client';

import { flutterwavePaymentOptions } from '@/features/checkout/lib/flutterwave';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { useEffect, useRef } from 'react';

export type FlutterwavePaySession = {
  publicKey: string;
  txRef: string;
  bookingId: string;
  amount: number;
  currency: string;
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  title: string;
  description: string;
  redirectUrl: string;
  paymentMethod: 'card' | 'transfer' | 'ussd';
};

type FlutterwaveCheckoutLauncherProps = {
  session: FlutterwavePaySession;
  onSuccess: (transactionId?: string) => void;
  onClose: () => void;
};

export function FlutterwaveCheckoutLauncher({
  session,
  onSuccess,
  onClose,
}: FlutterwaveCheckoutLauncherProps) {
  const started = useRef(false);
  const handleFlutterPayment = useFlutterwave({
    public_key: session.publicKey,
    tx_ref: session.txRef,
    amount: session.amount,
    currency: session.currency,
    payment_options: flutterwavePaymentOptions(session.paymentMethod),
    customer: {
      email: session.customer.email,
      name: session.customer.name,
      phone_number: session.customer.phone,
    },
    customizations: {
      title: session.title,
      description: session.description,
      logo: '/icon.svg',
    },
    redirect_url: session.redirectUrl,
  });

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    handleFlutterPayment({
      callback: (response) => {
        closePaymentModal();
        const transactionId =
          response?.transaction_id != null
            ? String(response.transaction_id)
            : undefined;
        onSuccess(transactionId);
      },
      onClose,
    });
  }, [handleFlutterPayment, onClose, onSuccess]);

  return null;
}
