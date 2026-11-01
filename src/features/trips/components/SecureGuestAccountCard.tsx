'use client';

import {
  claimGuestBookingAccount,
  confirmClaimGuestBookingAccount,
  getCustomerMe,
  resendCustomerOtp,
} from '@/data/api';
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
import { AppButton, LabeledField } from '@/shared/components';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
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
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [alreadyHasAccount, setAlreadyHasAccount] = useState(false);

  const bookingSession = () => {
    const bookingId = getPendingBookingId();
    const bookingToken = getBookingAccessToken(bookingId);
    return { bookingId, bookingToken };
  };

  const finishSession = async (tokens: {
    accessToken: string;
    accessTokenExpiresAt?: string;
    refreshToken?: string;
  }) => {
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
          email: profileUser?.email || claimEmail || 'guest',
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
  };

  const handleStart = async () => {
    setError(null);
    setNotice(null);
    setAlreadyHasAccount(false);
    const { bookingId, bookingToken } = bookingSession();
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
      const result = await claimGuestBookingAccount(
        bookingId,
        password,
        bookingToken,
      );
      setClaimEmail(result.email);
      setStep('otp');
      setNotice('We sent a verification code to your booking email.');
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.status === 409) {
        setAlreadyHasAccount(true);
        setError(submitError.message);
      } else {
        setError(errorMessage(submitError));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setError(null);
    setNotice(null);
    const { bookingId, bookingToken } = bookingSession();
    if (!bookingId || !bookingToken) {
      setError('This trip session expired. Open the link from your email.');
      return;
    }
    if (otp.trim().length < 4) {
      setError('Enter the verification code from your email.');
      return;
    }

    setSubmitting(true);
    try {
      const tokens = await confirmClaimGuestBookingAccount(
        bookingId,
        otp.trim(),
        bookingToken,
      );
      await finishSession(tokens);
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!claimEmail) return;
    setError(null);
    setSubmitting(true);
    try {
      await resendCustomerOtp({ email: claimEmail });
      setNotice('We sent a new verification code.');
    } catch (submitError) {
      setError(errorMessage(submitError));
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
        {step === 'password'
          ? 'Verify your email by creating a password to secure your account'
          : 'Enter the code we emailed you'}
      </Text>
      <Text color="ink.2" fontSize="14px" mt={1} mb={4}>
        {step === 'password'
          ? GUEST_PASSWORD_HINT
          : `Sent to ${claimEmail || 'your booking email'}.`}
      </Text>

      {step === 'password' ? (
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Create a password"
          autoComplete="new-password"
          mb="12px"
        />
      ) : (
        <LabeledField label="Verification code" mb="12px">
          <Input
            unstyled
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fontSize={{ base: '16px', md: '15px' }}
            w="full"
            outline="none"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
          />
        </LabeledField>
      )}

      {notice ? (
        <Text color="ok" fontSize="13px" mb={3}>
          {notice}
        </Text>
      ) : null}

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
          onClick={() =>
            void (step === 'password' ? handleStart() : handleConfirm())
          }
          disabled={submitting}
        >
          {submitting
            ? step === 'password'
              ? 'Sending…'
              : 'Verifying…'
            : step === 'password'
              ? 'Send verification code'
              : 'Verify and sign in'}
        </AppButton>
        {step === 'otp' ? (
          <AppButton
            variant="outlineMuted"
            onClick={() => void handleResend()}
            disabled={submitting}
          >
            Resend code
          </AppButton>
        ) : null}
        <Text fontSize="13px" color="ink.3">
          Already have an account? <Link href="/auth">Sign in</Link>
        </Text>
      </Flex>
    </Box>
  );
}
