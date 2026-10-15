import { ApiError } from '@/data/api/http';
import { mapPublicUnitDetailToProperty } from '@/data/lib/map-public-unit';
import type { PublicUnitDetail } from '@/data/types';
import { BookingCard } from '@/features/property/components/BookingCard';
import { useUnitQuote } from '@/features/property/hooks/usePropertyData';
import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { renderWithProviders } from '@/test/render';
import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('@/features/property/hooks/usePropertyData', () => ({
  useUnitQuote: vi.fn(),
}));

const detail: PublicUnitDetail = {
  id: 'unit-1',
  tenantId: 'tenant-1',
  name: 'Lekki Studio',
  summary: 'Bright studio',
  pictureUrl: null,
  propertyType: 'apartment',
  roomType: 'Entire Home',
  guests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: '1.0',
  currency: 'NGN',
  nightlyRate: '50000.00',
  instantBook: true,
  location: null,
  description: null,
  floor: null,
  cleaningFee: null,
  weeklyDiscountPercent: null,
  monthlyDiscountPercent: null,
  minNights: 1,
  maxNights: null,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  timezone: 'Africa/Lagos',
  houseRules: null,
  property: null,
  amenities: [],
  media: [],
  reviews: null,
};

function renderCard(limits: Pick<PublicUnitDetail, 'minNights' | 'maxNights'>) {
  const { property } = mapPublicUnitDetailToProperty({ ...detail, ...limits });
  return renderWithProviders(
    <BookingCard property={property} selectedUnit={property.units[0]!} />,
  );
}

function setStay(checkIn: string, checkOut: string) {
  act(() => {
    usePropertyBookingStore.getState().setDates(checkIn, checkOut);
  });
}

function quoteResult(overrides: Record<string, unknown> = {}) {
  return {
    data: undefined,
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useUnitQuote>;
}

const reserveButton = () => screen.getByRole('button', { name: 'Reserve' });
const storeStay = () => {
  const { checkIn, checkOut } = usePropertyBookingStore.getState();
  return { checkIn, checkOut };
};

describe('BookingCard stay limits', () => {
  beforeEach(() => {
    act(() => {
      usePropertyBookingStore.getState().reset();
    });
    vi.mocked(useUnitQuote).mockReturnValue(quoteResult());
  });

  it('notes the minimum and maximum stay under the dates', () => {
    setStay('2027-03-10', '2027-03-14');
    renderCard({ minNights: 3, maxNights: 10 });

    expect(
      screen.getByText('Minimum stay: 3 nights · Maximum stay: 10 nights'),
    ).toBeInTheDocument();
  });

  it('shows no note when any stay of one night or more is allowed', () => {
    setStay('2027-03-10', '2027-03-14');
    renderCard({ minNights: 1, maxNights: null });

    expect(screen.queryByText(/Minimum stay/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Maximum stay/)).not.toBeInTheDocument();
  });

  it('limits the check-out picker to the allowed stay lengths', () => {
    setStay('2027-03-10', '2027-03-14');
    renderCard({ minNights: 3, maxNights: 10 });

    const checkOut = screen.getByLabelText('Checkout');
    expect(checkOut).toHaveAttribute('min', '2027-03-13');
    expect(checkOut).toHaveAttribute('max', '2027-03-20');
  });

  it('leaves the check-out picker open-ended without a maximum', () => {
    setStay('2027-03-10', '2027-03-14');
    renderCard({ minNights: 2, maxNights: null });

    const checkOut = screen.getByLabelText('Checkout');
    expect(checkOut).toHaveAttribute('min', '2027-03-12');
    expect(checkOut).not.toHaveAttribute('max');
  });

  it('blocks a stay that is too short and skips the quote request', () => {
    setStay('2027-03-10', '2027-03-12');
    renderCard({ minNights: 3, maxNights: null });

    expect(
      screen.getByText('Minimum stay is 3 nights. Please pick different dates.'),
    ).toBeInTheDocument();
    expect(reserveButton()).toBeDisabled();
    expect(useUnitQuote).toHaveBeenLastCalledWith(null);
  });

  it('blocks a stay that is too long', () => {
    setStay('2027-03-10', '2027-03-25');
    renderCard({ minNights: 1, maxNights: 10 });

    expect(
      screen.getByText(
        'Maximum stay is 10 nights. Please pick different dates.',
      ),
    ).toBeInTheDocument();
    expect(reserveButton()).toBeDisabled();
  });

  it('quotes and allows reserving a stay inside the limits', () => {
    setStay('2027-03-10', '2027-03-14');
    renderCard({ minNights: 3, maxNights: 10 });

    expect(reserveButton()).toBeEnabled();
    expect(screen.queryByText(/Please pick different dates/)).toBeNull();
    expect(useUnitQuote).toHaveBeenLastCalledWith({
      unitId: 'unit-1',
      checkIn: '2027-03-10',
      checkOut: '2027-03-14',
      adults: 2,
    });
  });

  it('moves check-out forward when a later check-in makes the stay too short', () => {
    setStay('2027-03-10', '2027-03-14');
    renderCard({ minNights: 3, maxNights: null });

    fireEvent.change(screen.getByLabelText('Check-in'), {
      target: { value: '2027-03-13' },
    });

    expect(storeStay()).toEqual({
      checkIn: '2027-03-13',
      checkOut: '2027-03-16',
    });
  });

  it('moves check-out back when an earlier check-in makes the stay too long', () => {
    setStay('2027-03-10', '2027-03-20');
    renderCard({ minNights: 1, maxNights: 10 });

    fireEvent.change(screen.getByLabelText('Check-in'), {
      target: { value: '2027-03-05' },
    });

    expect(storeStay()).toEqual({
      checkIn: '2027-03-05',
      checkOut: '2027-03-15',
    });
  });

  it('keeps check-out when the new check-in still fits the limits', () => {
    setStay('2027-03-10', '2027-03-20');
    renderCard({ minNights: 3, maxNights: 10 });

    fireEvent.change(screen.getByLabelText('Check-in'), {
      target: { value: '2027-03-12' },
    });

    expect(storeStay()).toEqual({
      checkIn: '2027-03-12',
      checkOut: '2027-03-20',
    });
  });

  it('shows the field message from a rejected quote instead of the generic one', () => {
    setStay('2027-03-10', '2027-03-14');
    vi.mocked(useUnitQuote).mockReturnValue(
      quoteResult({
        isError: true,
        error: new ApiError({
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'The request contains invalid data',
          details: {
            fields: {
              checkOut: ['This unit needs a stay of at least 5 nights'],
            },
          },
        }),
      }),
    );
    renderCard({ minNights: 1, maxNights: null });

    expect(
      screen.getByText('This unit needs a stay of at least 5 nights'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('The request contains invalid data'),
    ).not.toBeInTheDocument();
  });
});
