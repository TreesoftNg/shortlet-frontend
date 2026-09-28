import { CheckoutPage } from '@/features/checkout';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CheckoutPage />
    </Suspense>
  );
}
