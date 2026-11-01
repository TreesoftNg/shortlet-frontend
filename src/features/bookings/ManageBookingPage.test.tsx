import { mapApiBookingToBooking } from '@/data/lib/map-booking';
import { useBooking } from '@/data/hooks';
import { ManageBookingPage } from '@/features/bookings/ManageBookingPage';
import { renderWithProviders } from '@/test/render';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/data/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/data/hooks')>()),
  useBooking: vi.fn(),
  useCancelBooking: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useStartBookingPayment: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('@/features/auth/hooks/useAuthHydrated', () => ({
  useAuthHydrated: () => true,
}));

vi.mock('@/features/auth/store/auth-store', () => ({
  isAuthApiError: () => false,
  useIsAuthenticated: () => true,
}));

// The page frame (header, nav) is not under test.
vi.mock('@/shared/components', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/components')>()),
  AppPage: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

function renderPage(address: string | null) {
  vi.mocked(useBooking).mockReturnValue({
    data: mapApiBookingToBooking({
      id: 'booking-1',
      reference: 'K7QH2MXP4D',
      status: 'confirmed',
      checkIn: '2026-11-10',
      checkOut: '2026-11-13',
      unit: { id: 'unit-1', name: 'Lekki 2-Bed', address },
    }),
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof useBooking>);
  return renderWithProviders(
    <QueryClientProvider client={new QueryClient()}>
      <ManageBookingPage bookingId="booking-1" />
    </QueryClientProvider>,
  );
}

describe('ManageBookingPage directions', () => {
  it("links Directions to the apartment's address on Google Maps", () => {
    renderPage('12 Isaac John Street, Ikeja, Lagos');

    const link = screen.getByRole('link', { name: /directions/i });
    expect(link).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=12%20Isaac%20John%20Street%2C%20Ikeja%2C%20Lagos',
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('hides Directions when the address is unknown', () => {
    renderPage(null);
    expect(screen.queryByRole('link', { name: /directions/i })).toBeNull();
  });
});
