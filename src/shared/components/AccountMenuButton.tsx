'use client';

/**
 * Account control:
 * - Mobile: avatar only → /account (or /auth if signed out)
 * - Desktop: menu + avatar dropdown
 */

import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { Box, Flex, Menu, Portal, Text } from '@chakra-ui/react';
import {
  CircleHelp,
  LogIn,
  LogOut,
  MapPin,
  Menu as MenuIcon,
  User,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type MenuLink = {
  value: string;
  href: string;
  label: string;
  icon: typeof User;
};

const guestLinks: MenuLink[] = [
  { value: 'auth', href: '/auth', label: 'Sign in', icon: LogIn },
  { value: 'search', href: '/search', label: 'Explore stays', icon: MapPin },
  { value: 'contact', href: '/contact', label: 'Help', icon: CircleHelp },
];

const memberLinks: MenuLink[] = [
  { value: 'account', href: '/account', label: 'Account', icon: UserRound },
  { value: 'contact', href: '/contact', label: 'Help', icon: CircleHelp },
];

function AvatarBadge({
  initials,
  size = '32px',
}: {
  initials?: string;
  size?: string;
}) {
  return (
    <Flex
      w={size}
      h={size}
      borderRadius="full"
      bg="brand.500"
      color="white"
      align="center"
      justify="center"
      fontSize="13px"
      fontWeight="700"
      flexShrink={0}
    >
      {initials ? initials : <User size={16} strokeWidth={1.9} />}
    </Flex>
  );
}

export function AccountMenuButton() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const links = isAuthenticated ? memberLinks : guestLinks;
  const accountHref = isAuthenticated ? '/account' : '/auth';

  return (
    <>
      {/* Mobile: avatar → account */}
      <Flex
        asChild
        display={{ base: 'flex', md: 'none' }}
        aria-label={isAuthenticated ? 'Your account' : 'Sign in'}
      >
        <Link href={accountHref}>
          <AvatarBadge initials={user?.avatarInitials} />
        </Link>
      </Flex>

      {/* Desktop: dropdown menu */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Menu.Root positioning={{ placement: 'bottom-end', gutter: 10 }}>
          <Menu.Trigger asChild>
            <Flex
              as="button"
              type="button"
              align="center"
              gap="10px"
              py="6px"
              pl="14px"
              pr="6px"
              border="1px solid"
              borderColor="line"
              borderRadius="full"
              boxShadow="0 1px 2px rgba(0,0,0,.04)"
              bg="bg"
              cursor="pointer"
              aria-label="Account menu"
              _hover={{ bg: 'bg.soft' }}
              _open={{ boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}
            >
              <MenuIcon size={18} strokeWidth={1.9} />
              <AvatarBadge initials={user?.avatarInitials} />
            </Flex>
          </Menu.Trigger>

          <Portal>
            <Menu.Positioner>
              <Menu.Content
                minW="220px"
                py="8px"
                borderRadius="16px"
                border="1px solid"
                borderColor="line"
                bg="bg"
                boxShadow="0 8px 28px rgba(0,0,0,.12)"
                zIndex={60}
              >
                {isAuthenticated && user ? (
                  <Box
                    px="14px"
                    py="10px"
                    borderBottom="1px solid"
                    borderColor="line"
                  >
                    <Text fontWeight="700" fontSize="14px">
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text color="ink.3" fontSize="12px" mt="2px">
                      {user.email}
                    </Text>
                  </Box>
                ) : null}

                {links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Menu.Item
                      key={item.value}
                      value={item.value}
                      asChild
                      px="14px"
                      py="10px"
                      fontSize="14px"
                      fontWeight="600"
                      cursor="pointer"
                      _highlighted={{ bg: 'bg.soft' }}
                    >
                      <Link href={item.href}>
                        <Flex align="center" gap="10px" w="full">
                          <Icon size={16} strokeWidth={1.9} />
                          {item.label}
                        </Flex>
                      </Link>
                    </Menu.Item>
                  );
                })}

                {isAuthenticated ? (
                  <>
                    <Menu.Separator my="6px" borderColor="line" />
                    <Menu.Item
                      value="logout"
                      px="14px"
                      py="10px"
                      fontSize="14px"
                      fontWeight="600"
                      cursor="pointer"
                      _highlighted={{ bg: 'bg.soft' }}
                      onSelect={() => {
                        logout();
                        router.push('/auth');
                      }}
                    >
                      <Flex align="center" gap="10px" w="full">
                        <LogOut size={16} strokeWidth={1.9} />
                        Log out
                      </Flex>
                    </Menu.Item>
                  </>
                ) : null}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>
    </>
  );
}
