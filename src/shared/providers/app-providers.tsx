'use client';

import { EmotionRegistry } from '@/shared/ui/emotion-registry';
import { Provider as ChakraUIProvider } from '@/shared/ui/provider';
import { QueryProvider } from '@/shared/providers/query-provider';

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <EmotionRegistry>
      <QueryProvider>
        <ChakraUIProvider>{children}</ChakraUIProvider>
      </QueryProvider>
    </EmotionRegistry>
  );
}
