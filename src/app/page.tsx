import type { Metadata } from 'next';
import { ComingSoonPage } from '@/features/coming-soon';
import { HomePage } from '@/features/home';
import { isComingSoonEnabled } from '@/shared/lib/coming-soon';

const comingSoon = isComingSoonEnabled();

export const metadata: Metadata = comingSoon
  ? {
      title: 'Coming soon',
      description:
        'Sunmade Apartments & Suites. Premium luxury apartments in Lagos are ready — our website is coming soon.',
      openGraph: {
        title: 'Coming soon · Sunmade Apartments & Suites',
        description:
          'Premium luxury apartments in Lagos are ready. Our website is coming soon.',
        type: 'website',
      },
    }
  : {
      title: 'Sunmade Apartments & Suites',
      description:
        'Premium luxury apartments in Lagos — verified, fully furnished, instantly bookable.',
    };

export default function Page() {
  if (comingSoon) {
    return <ComingSoonPage />;
  }
  return <HomePage />;
}
