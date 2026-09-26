'use client';

import { Flex, Text } from '@chakra-ui/react';
import {
  CircleUser,
  Heart,
  Luggage,
  MessageSquare,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Explore', icon: Search },
  { href: '/saved', label: 'Saved', icon: Heart },
  { href: '/trips', label: 'Trips', icon: Luggage },
  { href: '/inbox', label: 'Inbox', icon: MessageSquare },
  { href: '/account', label: 'Profile', icon: CircleUser },
];

export function MobileTabBar() {
  const pathname = usePathname();

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
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active =
          tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);

        return (
          <Flex
            key={tab.href}
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
