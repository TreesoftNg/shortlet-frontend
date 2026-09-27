'use client';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { pagePx } from '@/shared/layout';
import { SunmadeLogo } from '@/shared/components/brand';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Globe, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Stays' },
  { href: '/locations', label: 'Locations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const accountHref = isAuthenticated ? '/account' : '/auth';

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
      <Link href="/">
        <SunmadeLogo size={{ base: '17px', md: '20px' }} />
      </Link>

      <Flex
        as="nav"
        gap={{ md: '20px', lg: '30px' }}
        fontWeight="600"
        fontSize="14px"
        color="ink.2"
        display={{ base: 'none', md: 'flex' }}
      >
        {links.map((link) => {
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
        <Text display={{ base: 'none', lg: 'block' }}>₦ NGN</Text>
        <Box display={{ base: 'none', lg: 'block' }} color="ink.2">
          <Globe size={18} strokeWidth={1.9} />
        </Box>
        <Flex
          asChild
          align="center"
          gap="10px"
          py="6px"
          pl={{ base: '10px', md: '14px' }}
          pr="6px"
          border="1px solid"
          borderColor="line"
          borderRadius="full"
          boxShadow="0 1px 2px rgba(0,0,0,.04)"
        >
          <Link href={accountHref}>
            <Menu size={18} strokeWidth={1.9} />
            <Flex
              w="32px"
              h="32px"
              borderRadius="full"
              bg="brand.500"
              color="white"
              align="center"
              justify="center"
              fontSize="13px"
              fontWeight="700"
            >
              {user?.avatarInitials ? (
                user.avatarInitials
              ) : (
                <User size={16} strokeWidth={1.9} />
              )}
            </Flex>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
