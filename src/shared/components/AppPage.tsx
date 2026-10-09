'use client';

import { MobileTabBar } from '@/shared/components/MobileTabBar';
import { SiteFooter } from '@/shared/components/SiteFooter';
import { SiteHeader } from '@/shared/components/SiteHeader';
import { pagePx } from '@/shared/layout';
import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type AppPageProps = {
  children: ReactNode;
  header?: ReactNode | false;
  footer?: boolean;
  mobileTabBar?: boolean;
  /** Constrain main content width */
  mainMaxW?: string | number;
  /** Extra main padding bottom (tab bar safe area applied when mobileTabBar) */
  mainPt?: object | number | string;
  mainPb?: object | number | string;
  /** When false, children are the full page body (no pagePx main wrapper) */
  wrapMain?: boolean;
};

export function AppPage({
  children,
  header,
  footer = true,
  mobileTabBar = true,
  mainMaxW,
  mainPt,
  mainPb,
  wrapMain = true,
}: AppPageProps) {
  const defaultPb = mobileTabBar
    ? { base: '100px', md: '80px' }
    : { base: '40px', md: 12 };

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      {header === false ? null : (header ?? <SiteHeader />)}

      {wrapMain ? (
        <Box
          as="main"
          px={pagePx}
          pt={mainPt}
          pb={mainPb ?? defaultPb}
          maxW={mainMaxW}
          mx={mainMaxW ? 'auto' : undefined}
          w="full"
        >
          {children}
        </Box>
      ) : (
        children
      )}

      {footer ? <SiteFooter /> : null}
      {mobileTabBar ? <MobileTabBar /> : null}
    </Box>
  );
}
