import { ManageBookingPage } from '@/features/bookings';
import { Suspense } from 'react';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <ManageBookingPage bookingId={id} />   
    </Suspense>
  );
}
