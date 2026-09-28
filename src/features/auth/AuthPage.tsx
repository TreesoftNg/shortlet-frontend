'use client';

import { AuthArtPanel } from '@/features/auth/components/AuthArtPanel';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import { useIsAuthenticated } from '@/features/auth/store/auth-store';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthPage() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace('/account');
    }
  }, [hydrated, isAuthenticated, router]);

  return (
    <Box bg="bg" maxW="1440px" mx="auto" minH="100vh">
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        minH={{ md: '100vh' }}
      >
        <AuthArtPanel />
        <Flex align="center" justify="center" py={{ base: 2, md: 8 }}>
          <AuthForm />
        </Flex>
      </Grid>
    </Box>
  );
}
