'use client';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { AppButton, Surface } from '@/shared/components';
import type { AuthUser } from '@/features/auth/types';
import { Box, Flex, Text } from '@chakra-ui/react';
import { LogOut, Mail, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ProfileCardProps = {
  user: AuthUser;
};

export function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <Surface radius="lg" p={{ base: '20px', md: '28px' }}>
      <Flex
        align={{ base: 'start', sm: 'center' }}
        gap="18px"
        direction={{ base: 'column', sm: 'row' }}
      >
        <Flex
          w="72px"
          h="72px"
          borderRadius="full"
          bg="brand.500"
          color="white"
          align="center"
          justify="center"
          fontSize="24px"
          fontWeight="800"
          flexShrink={0}
        >
          {user.avatarInitials}
        </Flex>

        <Box flex="1" minW={0}>
          <Text
            fontSize={{ base: '22px', md: '24px' }}
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            {user.firstName} {user.lastName}
          </Text>
          <Text color="ink.2" fontSize="14px" mt="2px">
            @{user.username}
          </Text>

          <Flex
            mt="14px"
            gap={{ base: '10px', md: '18px' }}
            direction={{ base: 'column', sm: 'row' }}
            flexWrap="wrap"
            color="ink.2"
            fontSize="14px"
          >
            <Flex align="center" gap="8px">
              <Mail size={16} strokeWidth={1.9} />
              {user.email}
            </Flex>
            <Flex align="center" gap="8px">
              <UserRound size={16} strokeWidth={1.9} />
              Guest account
            </Flex>
          </Flex>
        </Box>

        <AppButton
          variant="outlineMuted"
          size="sm"
          leftIcon={<LogOut size={16} strokeWidth={1.9} />}
          onClick={handleLogout}
        >
          Log out
        </AppButton>
      </Flex>
    </Surface>
  );
}
