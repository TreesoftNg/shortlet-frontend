import type { Metadata } from 'next';
import { AppProviders } from '@/shared/providers/app-providers';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sunmade Apartments & Suites',
  description:
    'Serviced shortlet apartments across Lagos & Abuja — verified, fully furnished, instantly bookable.',
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
