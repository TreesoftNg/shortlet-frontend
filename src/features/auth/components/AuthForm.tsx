'use client';

import {
  createCustomerAccount,
  loginCustomer,
  resendCustomerOtp,
  verifyCustomerOtp,
} from '@/data/api/customers';
import { ApiError } from '@/data/api/http';
import { mapCustomerUser } from '@/features/auth/lib/map-customer-user';
import {
  GUEST_PASSWORD_HINT,
  isValidGuestPassword,
} from '@/features/auth/lib/password';
import { useAuthStore } from '@/features/auth/store/auth-store';
import type { AuthMode } from '@/features/auth/types';
import { PasswordField } from '@/features/auth/components/PasswordField';
import { AppButton, LabeledField } from '@/shared/components';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
}

const fieldInputProps = {
  unstyled: true,
  fontSize: '15px',
  w: 'full',
  outline: 'none',
  lineHeight: '1.4',
  color: 'ink',
  _placeholder: { color: 'ink.3', fontWeight: '500' },
} as const;

export function AuthForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [mode, setMode] = useState<AuthMode>('signin');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [remember, setRemember] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isSignIn = mode === 'signin';

  const resetAlerts = () => {
    setError(null);
    setNotice(null);
  };

  const completeLogin = async () => {
    const result = await loginCustomer({
      email: email.trim(),
      password,
    });
    if (!result?.accessToken) {
      throw new Error('Sign-in did not return an access token.');
    }
    setSession({
      user: mapCustomerUser(result, {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      }),
      accessToken: result.accessToken,
      refreshToken: result.refreshToken ?? null,
      accessTokenExpiresAt: result.accessTokenExpiresAt ?? null,
    });
    router.push('/account');
  };

  const handleSubmit = async () => {
    resetAlerts();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Enter your email and password.');
      return;
    }

    if (!isSignIn && step === 'credentials') {
      if (!firstName.trim() || !lastName.trim()) {
        setError('Enter your first and last name.');
        return;
      }
      if (!isValidGuestPassword(password)) {
        setError(GUEST_PASSWORD_HINT);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    if (!isSignIn && step === 'otp' && otp.trim().length < 4) {
      setError('Enter the verification code from your email.');
      return;
    }

    setSubmitting(true);
    try {
      if (isSignIn) {
        await completeLogin();
        return;
      }

      if (step === 'credentials') {
        await createCustomerAccount({
          email: trimmedEmail,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password,
        });
        setStep('otp');
        setNotice('We sent a verification code to your email.');
        return;
      }

      await verifyCustomerOtp({ email: trimmedEmail, otp: otp.trim() });
      try {
        await completeLogin();
      } catch (loginError) {
        setMode('signin');
        setStep('credentials');
        setNotice('Email verified. Sign in to continue.');
        setError(errorMessage(loginError));
      }
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    resetAlerts();
    setSubmitting(true);
    try {
      await resendCustomerOtp({ email: email.trim() });
      setNotice('A new code is on its way.');
    } catch (resendError) {
      setError(errorMessage(resendError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box w="full" maxW="420px" px={{ base: 5, md: 0 }} py={{ base: 8, md: 0 }}>
      <Heading
        as="h1"
        fontSize={{ base: '28px', md: '30px' }}
        fontWeight="800"
        letterSpacing="-0.02em"
      >
        {step === 'otp'
          ? 'Check your email'
          : isSignIn
            ? 'Welcome back'
            : 'Create your account'}
      </Heading>
      <Text color="ink.2" fontSize="14px" mt="6px">
        {step === 'otp'
          ? `Enter the code we sent to ${email.trim()}.`
          : isSignIn
            ? 'Sign in to manage your bookings and check out faster.'
            : 'Join Sunmade to book verified shortlets across Lagos & Abuja.'}
      </Text>

      {step === 'credentials' ? (
        <Grid
          templateColumns="1fr 1fr"
          bg="bg.soft"
          borderRadius="12px"
          p="4px"
          mt="28px"
          mb="24px"
        >
          {(
            [
              { id: 'signin' as const, label: 'Sign in' },
              { id: 'signup' as const, label: 'Create account' },
            ] as const
          ).map((item) => {
            const on = mode === item.id;
            return (
              <Text
                key={item.id}
                as="button"
                textAlign="center"
                py="10px"
                borderRadius="9px"
                fontWeight="700"
                fontSize="14px"
                color={on ? 'ink' : 'ink.3'}
                bg={on ? 'white' : 'transparent'}
                boxShadow={on ? '0 1px 3px rgba(0,0,0,.08)' : 'none'}
                border="none"
                cursor="pointer"
                onClick={() => {
                  setMode(item.id);
                  resetAlerts();
                }}
              >
                {item.label}
              </Text>
            );
          })}
        </Grid>
      ) : (
        <Box h="28px" />
      )}

      {error ? (
        <Text
          color="danger"
          fontSize="14px"
          mb="14px"
          role="alert"
        >
          {error}
        </Text>
      ) : null}
      {notice ? (
        <Text color="ok" fontSize="14px" mb="14px">
          {notice}
        </Text>
      ) : null}

      {step === 'otp' ? (
        <>
          <LabeledField label="Verification code" mb="12px">
            <Input
              {...fieldInputProps}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              autoComplete="one-time-code"
              inputMode="numeric"
            />
          </LabeledField>
          <AppButton
            size="lg"
            fullWidth
            disabled={submitting}
            onClick={() => {
              void handleSubmit();
            }}
          >
            {submitting ? 'Verifying…' : 'Verify email'}
          </AppButton>
          <Flex justify="space-between" mt="16px" fontSize="14px">
            <Box
              as="button"
              fontWeight="700"
              bg="transparent"
              border="none"
              cursor={submitting ? 'not-allowed' : 'pointer'}
              opacity={submitting ? 0.6 : 1}
              onClick={() => {
                if (submitting) return;
                void handleResend();
              }}
            >
              Resend code
            </Box>
            <Text
              as="button"
              color="ink.3"
              bg="transparent"
              border="none"
              cursor="pointer"
              onClick={() => {
                setStep('credentials');
                setOtp('');
                resetAlerts();
              }}
            >
              Back
            </Text>
          </Flex>
        </>
      ) : (
        <>
          {!isSignIn ? (
            <Flex gap="12px" mb="12px" direction={{ base: 'column', sm: 'row' }}>
              <LabeledField label="First name" flex="1">
                <Input
                  {...fieldInputProps}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                />
              </LabeledField>
              <LabeledField label="Last name" flex="1">
                <Input
                  {...fieldInputProps}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  autoComplete="family-name"
                />
              </LabeledField>
            </Flex>
          ) : null}

          <LabeledField label="Email" emphasized={emailFocused} mb="12px">
            <Input
              {...fieldInputProps}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Email address"
              autoComplete="email"
            />
          </LabeledField>

          <PasswordField
            value={password}
            onChange={setPassword}
            placeholder={isSignIn ? 'Password' : 'Create a password'}
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            mb={!isSignIn ? '8px' : '12px'}
          />
          {!isSignIn ? (
            <>
              <Text color="ink.3" fontSize="12px" mb="12px">
                {GUEST_PASSWORD_HINT}
              </Text>
              <PasswordField
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm password"
                aria-label="Confirm password"
                autoComplete="new-password"
              />
            </>
          ) : null}

          {isSignIn ? (
            <Flex
              justify="space-between"
              align="center"
              gap="12px"
              mt="4px"
              mb="22px"
              fontSize="14px"
              direction={{ base: 'column', sm: 'row' }}
            >
              <Flex
                as="button"
                gap="8px"
                align="center"
                color="ink.2"
                bg="transparent"
                border="none"
                cursor="pointer"
                lineHeight="1.3"
                onClick={() => setRemember((v) => !v)}
              >
                <Flex
                  w="18px"
                  h="18px"
                  borderRadius="5px"
                  bg={remember ? 'ink' : 'white'}
                  border={remember ? 'none' : '1px solid'}
                  borderColor="line"
                  align="center"
                  justify="center"
                  color="white"
                  flexShrink={0}
                >
                  {remember ? <Check size={12} strokeWidth={2.5} /> : null}
                </Flex>
                Remember me
              </Flex>
              <Box
                textAlign={{ base: 'center', sm: 'right' }}
                lineHeight="1.35"
              >
                <Text fontWeight="700" fontSize="14px">
                  Forgot password?
                </Text>
                <Box color="ink.3" fontSize="13px">
                  <a href="mailto:hello@sunmadeapartments.com">
                    hello@sunmadeapartments.com
                  </a>
                </Box>
              </Box>
            </Flex>
          ) : (
            <Box h="10px" />
          )}

          <AppButton
            size="lg"
            fullWidth
            disabled={submitting}
            onClick={() => {
              void handleSubmit();
            }}
          >
            {submitting
              ? isSignIn
                ? 'Signing in…'
                : 'Creating account…'
              : 'Continue'}
          </AppButton>
        </>
      )}

      <Text color="ink.3" fontSize="13px" textAlign="center" mt="20px">
        By continuing you agree to our{' '}
        <Text as="u" cursor="pointer">
          Terms
        </Text>{' '}
        and{' '}
        <Text as="u" cursor="pointer">
          Privacy Policy
        </Text>
        .
      </Text>
    </Box>
  );
}
