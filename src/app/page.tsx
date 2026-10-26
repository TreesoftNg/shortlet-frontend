import type { Metadata } from 'next';
import { HomePage } from '@/features/home';

export const metadata: Metadata = {
  title: 'Sunmade Apartments & Suites',
  description:
    'Premium luxury apartments in Lagos — verified, fully furnished, instantly bookable.',
};

export default function Page() {
  return <HomePage />;
}
