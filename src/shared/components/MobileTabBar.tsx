'use client';

/**
 * Mobile-only bottom nav. Desktop uses SiteHeader + account menu instead.
 */

import { UnreadBadge } from '@/features/messages/components/UnreadBadge';
import { useIsAuthenticated } from '@/features/auth/store/auth-store';
import { Box, Flex, Text } from '@chakra-ui/react';
import {
  Building2,
  CircleUser,
  Home,
  Luggage,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: (pathname: string) => boolean;
  showUnread?: boolean;
};

export function MobileTabBar() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();

  const tabs: Tab[] = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      match: (path) => path === '/',
    },
    {
      href: '/search?tab=all',
      label: 'Stays',
      icon: Building2,
      match: (path) => path.startsWith('/search'),
    },
    {
      href: '/trips',
      label: 'Trips',
      icon: Luggage,
      match: (path) => path.startsWith('/trips'),
    },
    {
      href: isAuthenticated ? '/messages' : '/auth',
      label: 'Inbox',
      icon: MessageCircle,
      match: (path) => path.startsWith('/messages'),
      showUnread: isAuthenticated,
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
              <Box position="relative" display="inline-flex">
                <Icon size={22} strokeWidth={1.9} />
                {tab.showUnread ? <UnreadBadge /> : null}
              </Box>
              <Text as="span">{tab.label}</Text>
            </Link>
          </Flex>
        );
      })}
    </Flex>
  );
}
