import { Provider as ChakraUIProvider } from '@/shared/ui/provider';
import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';

function TestProviders({ children }: { children: ReactNode }) {
  return <ChakraUIProvider>{children}</ChakraUIProvider>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: TestProviders, ...options });
}
