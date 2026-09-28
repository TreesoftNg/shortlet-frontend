import type { Metadata } from 'next';
import { ComingSoonPage } from '@/features/coming-soon';

export const metadata: Metadata = {
  title: 'Coming soon',
  description:
    'Sunmade Apartments & Suites. Serviced shortlet apartments in Lagos are ready — our website is coming soon.',
  openGraph: {
    title: 'Coming soon · Sunmade Apartments & Suites',
    description:
      'Serviced shortlet apartments in Lagos are ready. Our website is coming soon.',
    type: 'website',
  },
};

export default function Page() {
  return <ComingSoonPage />;
}
