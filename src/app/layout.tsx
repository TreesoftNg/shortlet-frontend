import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AppProviders } from '@/shared/providers/app-providers';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sunmade Apartments & Suites',
    template: '%s · Sunmade Apartments & Suites',
  },
  description:
    'Serviced shortlet apartments across Lagos & Abuja — verified, fully furnished, instantly bookable.',
};

export const viewport: Viewport = {
  themeColor: '#10695B',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <body className={plusJakarta.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
