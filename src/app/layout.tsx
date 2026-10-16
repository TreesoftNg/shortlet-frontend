import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AppProviders } from '@/shared/providers/app-providers';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Sunmade Luxury Shortlets & Suites',
    template: '%s · Sunmade Luxury Shortlets & Suites',
  },
  description:
    'A verified, fully furnished shortlet — clean, comfortable, and instantly bookable.',
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
