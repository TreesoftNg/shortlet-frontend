'use client';

import { useAuthStore } from '@/features/auth/store/auth-store';
import type { AuthMode } from '@/features/auth/types';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.4 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3.1-1.6-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.7-2.9-.7-1.5 0-2.8.8-3.6 2.1-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.3 2.7 2.2 1.1-.1 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.1-2.4 1.1-2.4s-2.2-.8-2.2-3.3zM14.5 5.8c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
    </svg>
  );
}

export function AuthForm() {
  const router = useRouter();
  const mode = useAuthStore((s) => s.mode);
  const setMode = useAuthStore((s) => s.setMode);
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('temi@example.com');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [emailFocused, setEmailFocused] = useState(true);

  const isSignIn = mode === 'signin';

  const handleSubmit = () => {
    login(email.trim());
    router.push('/account');
  };

  return (
    <Box w="full" maxW="420px" px={{ base: 5, md: 0 }} py={{ base: 8, md: 0 }}>
      <Heading
        as="h1"
        fontSize={{ base: '28px', md: '30px' }}
        fontWeight="800"
        letterSpacing="-0.02em"
      >
        {isSignIn ? 'Welcome back' : 'Create your account'}
      </Heading>
      <Text color="ink.2" fontSize="14px" mt="6px">
        {isSignIn
          ? 'Sign in to manage your bookings and check out faster.'
          : 'Join Haven to book verified shortlets across Lagos & Abuja.'}
      </Text>

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
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </Text>
          );
        })}
      </Grid>

      {!isSignIn ? (
        <Flex gap="12px" mb="12px" direction={{ base: 'column', sm: 'row' }}>
          <FieldBox label="First name">
            <Input
              unstyled
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Temitope"
              fontSize="15px"
              w="full"
              outline="none"
            />
          </FieldBox>
          <FieldBox label="Last name">
            <Input
              unstyled
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Aladesiun"
              fontSize="15px"
              w="full"
              outline="none"
            />
          </FieldBox>
        </Flex>
      ) : null}

      <FieldBox label="Email" focused={emailFocused} mb="12px">
        <Input
          unstyled
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          fontSize="15px"
          w="full"
          outline="none"
        />
      </FieldBox>

      <FieldBox label="Password" mb="12px">
        <Flex align="center" justify="space-between" gap={2}>
          <Input
            unstyled
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fontSize="15px"
            w="full"
            outline="none"
          />
          <Box
            as="button"
            color="ink.3"
            bg="transparent"
            border="none"
            cursor="pointer"
            p={0}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.9} />
            ) : (
              <Eye size={18} strokeWidth={1.9} />
            )}
          </Box>
        </Flex>
      </FieldBox>

      {isSignIn ? (
        <Flex
          justify="space-between"
          fontSize="14px"
          mt="4px"
          mb="22px"
          align="center"
        >
          <Flex
            as="button"
            gap="8px"
            align="center"
            color="ink.2"
            bg="transparent"
            border="none"
            cursor="pointer"
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
            >
              {remember ? <Check size={12} strokeWidth={2.5} /> : null}
            </Flex>
            Remember me
          </Flex>
          <Text as="u" fontWeight="700" cursor="pointer">
            Forgot password?
          </Text>
        </Flex>
      ) : (
        <Box h="22px" />
      )}

      <Button
        w="full"
        h="52px"
        borderRadius="12px"
        bg="brand.500"
        color="white"
        fontWeight="700"
        fontSize="15px"
        _hover={{ bg: 'brand.600' }}
        onClick={handleSubmit}
      >
        Continue
      </Button>

      <Flex align="center" gap="14px" color="ink.3" fontSize="13px" my="22px">
        <Box flex="1" h="1px" bg="line" />
        or
        <Box flex="1" h="1px" bg="line" />
      </Flex>

      <Flex
        as="button"
        w="full"
        h="50px"
        align="center"
        justify="center"
        borderRadius="12px"
        border="1px solid"
        borderColor="#C9C9C4"
        bg="white"
        color="ink"
        fontWeight="700"
        fontSize="15px"
        gap="12px"
        mb="10px"
        cursor="pointer"
        _hover={{ bg: 'bg.soft' }}
        onClick={handleSubmit}
      >
        <GoogleIcon />
        Continue with Google
      </Flex>
      <Flex
        as="button"
        w="full"
        h="50px"
        align="center"
        justify="center"
        borderRadius="12px"
        border="1px solid"
        borderColor="#C9C9C4"
        bg="white"
        color="ink"
        fontWeight="700"
        fontSize="15px"
        gap="12px"
        cursor="pointer"
        _hover={{ bg: 'bg.soft' }}
        onClick={handleSubmit}
      >
        <AppleIcon />
        Continue with Apple
      </Flex>

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

function FieldBox({
  label,
  children,
  focused,
  mb,
}: {
  label: string;
  children: React.ReactNode;
  focused?: boolean;
  mb?: string;
}) {
  return (
    <Box
      border={focused ? '2px solid' : '1px solid'}
      borderColor={focused ? 'ink' : '#D5D5D0'}
      borderRadius="12px"
      px={focused ? '15px' : '16px'}
      py={focused ? '11px' : '12px'}
      mb={mb}
      flex="1"
      w="full"
    >
      <Text
        fontSize="11px"
        fontWeight="700"
        textTransform="uppercase"
        letterSpacing="0.04em"
        mb="2px"
      >
        {label}
      </Text>
      {children}
    </Box>
  );
}
