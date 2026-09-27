'use client';

/**
 * Mobile-only bottom nav. Desktop uses SiteHeader + account menu instead.
 * Only include routes that exist — no Saved/Inbox until those pages ship.
 */

import { useIsAuthenticated } from '@/features/auth/store/auth-store';
import { Flex, Text } from '@chakra-ui/react';
import { CircleUser, Luggage, Search, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
};

export function MobileTabBar() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();

  const tabs: Tab[] = [
    {
      href: '/',
      label: 'Explore',
      icon: Search,
      match: (path) => path === '/',
    },
    {
      href: '/trips',
      label: 'Trips',
      icon: Luggage,
      match: (path) => path.startsWith('/trips'),
    },
    {
      href: isAuthenticated ? '/account' : '/auth',
      label: 'Profile',
      icon: CircleUser,
      match: (path) =>
        path.startsWith('/account') || path.startsWith('/auth'),
    },
  ];

  return (
    <Flex
      as="nav"
      display={{ base: 'flex', md: 'none' }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      h="72px"
      bg="bg"
      borderTop="1px solid"
      borderColor="line"
      justify="space-around"
      pt="10px"
      pb="calc(10px + env(safe-area-inset-bottom))"
      zIndex={50}
      maxW="1440px"
      mx="auto"
      aria-label="Mobile navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.match?.(pathname) ?? pathname.startsWith(tab.href);

        return (
          <Flex
            key={tab.label}
            asChild
            direction="column"
            align="center"
            gap="3px"
            fontSize="10px"
            fontWeight="600"
            color={active ? 'brand.500' : 'ink.3'}
            minW="56px"
          >
            <Link href={tab.href}>
              <Icon size={22} strokeWidth={1.9} />
              <Text as="span">{tab.label}</Text>
            </Link>
          </Flex>
        );
      })}
    </Flex>
  );
}
