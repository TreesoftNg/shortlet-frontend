import { mapApiBookingToBooking } from '@/data/lib/map-booking';
import { UpcomingTripCard } from '@/features/trips/components/UpcomingTripCard';
import { renderWithProviders } from '@/test/render';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

function renderCard(address: string | null) {
  const booking = mapApiBookingToBooking({
    id: 'booking-1',
    reference: 'K7QH2MXP4D',
    status: 'confirmed',
    checkIn: '2026-11-10',
    checkOut: '2026-11-13',
    unit: { id: 'unit-1', name: 'Lekki 2-Bed', address },
  });
  return renderWithProviders(
    <QueryClientProvider client={new QueryClient()}>
      <UpcomingTripCard booking={booking} />
    </QueryClientProvider>,
  );
}

describe('UpcomingTripCard directions', () => {
  it("opens Google Maps at the apartment's address in a new tab", () => {
    renderCard('5 Admiralty Way, Lekki, Lagos');

    const link = screen.getByRole('link', { name: /directions/i });
    expect(link).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=5%20Admiralty%20Way%2C%20Lekki%2C%20Lagos',
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it('hides Directions when the address is unknown', () => {
    renderCard(null);
    expect(screen.queryByText(/directions/i)).not.toBeInTheDocument();
  });
});
