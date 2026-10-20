'use client';

import { claimGuestBookingAccount, getCustomerMe } from '@/data/api';
import { ApiError } from '@/data/api/http';
import {
  clearBookingSession,
  getBookingAccessToken,
  getPendingBookingId,
} from '@/data/lib/booking-session';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { mapCustomerUser } from '@/features/auth/lib/map-customer-user';
import {
  GUEST_PASSWORD_HINT,
  isValidGuestPassword,
} from '@/features/auth/lib/password';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { AppButton } from '@/shared/components';
import { Box, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';

type SecureGuestAccountCardProps = {
  onSecured?: () => void;
};

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

export function SecureGuestAccountCard({
  onSecured,
}: SecureGuestAccountCardProps) {
  const setSession = useAuthStore((s) => s.setSession);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyHasAccount, setAlreadyHasAccount] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setAlreadyHasAccount(false);
    const bookingId = getPendingBookingId();
    const bookingToken = getBookingAccessToken(bookingId);
    if (!bookingId || !bookingToken) {
      setError('This trip session expired. Open the link from your email.');
      return;
    }
    if (!isValidGuestPassword(password)) {
      setError(GUEST_PASSWORD_HINT);
      return;
    }

    setSubmitting(true);
    try {
      const tokens = await claimGuestBookingAccount(
        bookingId,
        password,
        bookingToken,
      );
      if (!tokens?.accessToken) {
        throw new Error('Could not start your session.');
      }

      let profileUser:
        | { id: string; email: string; firstName: string; lastName: string }
        | undefined;
      try {
        const profile = await getCustomerMe(tokens.accessToken);
        profileUser = {
          id: profile.id,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
        };
      } catch {
        // Session still works; names come from JWT / fallbacks.
      }

      setSession({
        user: mapCustomerUser(
          { ...tokens, user: profileUser },
          {
            email: profileUser?.email || 'guest',
            firstName: profileUser?.firstName,
            lastName: profileUser?.lastName,
          },
        ),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt ?? null,
      });
      clearBookingSession();
      onSecured?.();
    } catch (submitError) {
      if (
        submitError instanceof ApiError &&
        submitError.status === 409
      ) {
        setAlreadyHasAccount(true);
        setError(submitError.message);
      } else {
        setError(errorMessage(submitError));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      mb={{ base: 4, md: 5 }}
      mt={4}
      bg="white"
      border="1px solid"
      borderColor="line"
      borderRadius="18px"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
    >
      <Text fontWeight="800" fontSize="16px">
        Verify your email by creating a password to secure your account
      </Text>
      <Text color="ink.2" fontSize="14px" mt={1} mb={4}>
        {GUEST_PASSWORD_HINT}
      </Text>

      <PasswordField
        label="Password"
        value={password}
        onChange={setPassword}
        placeholder="Create a password"
        autoComplete="new-password"
        mb="12px"
      />

      {error ? (
        <Text color="danger" fontSize="13px" mb={3}>
          {error}
          {alreadyHasAccount ? (
            <>
              {' '}
              <Text as="span" color="ink">
                <Link href="/auth">Sign in</Link>
              </Text>
            </>
          ) : null}
        </Text>
      ) : null}

      <Flex gap={3} align="center" flexWrap="wrap">
        <AppButton
          onClick={() => void handleSubmit()}
          disabled={submitting}
        >
          {submitting ? 'Securing…' : 'Secure my account'}
        </AppButton>
        <Text fontSize="13px" color="ink.3">
          Already have an account?{' '}
          <Link href="/auth">Sign in</Link>
        </Text>
      </Flex>
    </Box>
  );
}
