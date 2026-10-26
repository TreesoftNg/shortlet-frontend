'use client';

import { AuthSessionProvider } from '@/shared/providers/auth-session-provider';
import { QueryProvider } from '@/shared/providers/query-provider';
import { EmotionRegistry } from '@/shared/ui/emotion-registry';
import { Provider as ChakraUIProvider } from '@/shared/ui/provider';

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <EmotionRegistry>
      <QueryProvider>
        <ChakraUIProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </ChakraUIProvider>
      </QueryProvider>
    </EmotionRegistry>
  );
}
