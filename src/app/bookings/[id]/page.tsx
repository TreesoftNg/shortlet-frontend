import { ManageBookingPage } from '@/features/bookings';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ManageBookingPage bookingId={id} />;
}
