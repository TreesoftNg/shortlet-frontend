'use client';

import { AccountMenuButton } from '@/shared/components/AccountMenuButton';
import { SunmadeLogo } from '@/shared/components/brand';
import { pagePx } from '@/shared/layout';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavLink = {
  href: string;
  label: string;
};

/** Single primary nav for the customer site (discover / brand). */
const navLinks: NavLink[] = [
  { href: '/', label: 'Stays' },
  { href: '/locations', label: 'Locations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

type SiteHeaderProps = {
  /**
   * @deprecated Trips no longer uses a separate primary nav.
   * Kept optional so call sites can still pass it without breaking.
   */
  variant?: 'marketing' | 'trips';
  showCurrency?: boolean;
};

export function SiteHeader({
  variant: _variant = 'marketing',
  showCurrency = true,
}: SiteHeaderProps) {
  const pathname = usePathname();

  return (
    <Flex
      as="header"
      h={{ base: '64px', md: '72px', lg: '80px' }}
      align="center"
      justify="space-between"
      px={pagePx}
      borderBottom="1px solid"
      borderColor="line"
      bg="bg"
      maxW="1440px"
      mx="auto"
      w="full"
      position="sticky"
      top={0}
      zIndex={40}
    >
      <Flex asChild align="center" h="full">
        <Link href="/">
          <SunmadeLogo size={{ base: '17px', md: '20px' }} />
        </Link>
      </Flex>

      <Flex
        as="nav"
        gap={{ md: '20px', lg: '30px' }}
        fontWeight="600"
        fontSize="14px"
        color="ink.2"
        display={{ base: 'none', md: 'flex' }}
      >
        {navLinks.map((link) => {
          const active =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href);

          return (
            <Box
              key={link.label}
              asChild
              color={active ? 'ink' : 'ink.2'}
              position="relative"
              _after={
                active
                  ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: { md: '-24px', lg: '-29px' },
                      h: '2px',
                      bg: 'ink',
                    }
                  : undefined
              }
            >
              <Link href={link.href}>{link.label}</Link>
            </Box>
          );
        })}
      </Flex>

      <Flex
        align="center"
        gap={{ base: '8px', md: '14px' }}
        fontSize="14px"
        fontWeight="600"
      >
        {showCurrency ? (
          <Text display={{ base: 'none', lg: 'block' }}>₦ NGN</Text>
        ) : null}
        {showCurrency ? (
          <Box display={{ base: 'none', lg: 'block' }} color="ink.2">
            <Globe size={18} strokeWidth={1.9} />
          </Box>
        ) : null}
        <AccountMenuButton />
      </Flex>
    </Flex>
  );
}
