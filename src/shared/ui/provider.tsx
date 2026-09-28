'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@/shared/theme';

type ProviderProps = {
  children: React.ReactNode;
};

/**
 * Light-mode only for MVP — skip next-themes to avoid
 * script-injection hydration mismatches with Emotion.
 */
export function Provider({ children }: ProviderProps) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
