import { PropertyHeaderBar } from '@/features/property/components/PropertyHeaderBar';
import { usePropertyBookingStore } from '@/features/property/store/property-booking-store';
import { formatDatesRangeLabel } from '@/shared/lib/format';
import { renderWithProviders } from '@/test/render';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

// The account menu needs auth + React Query; it is not under test here.
vi.mock('@/shared/components', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/components')>()),
  AccountMenuButton: () => null,
}));

function setStay(checkIn: string, checkOut: string) {
  act(() => {
    usePropertyBookingStore.getState().setDates(checkIn, checkOut);
  });
}

async function openDates(checkIn: string, checkOut: string) {
  await userEvent
    .setup()
    .click(screen.getByText(formatDatesRangeLabel(checkIn, checkOut)));
  const [checkInInput, checkOutInput] =
    document.querySelectorAll<HTMLInputElement>('input[type="date"]');
  return { checkInInput: checkInInput!, checkOutInput: checkOutInput! };
}

describe('PropertyHeaderBar stay limits', () => {
  beforeEach(() => {
    act(() => {
      usePropertyBookingStore.getState().reset();
    });
  });

  it('limits the check-out input and notes the stay limits', async () => {
    setStay('2027-03-10', '2027-03-14');
    renderWithProviders(
      <PropertyHeaderBar
        locationLabel="Lekki"
        stayLimits={{ min_nights: 3, max_nights: 10 }}
      />,
    );

    const { checkOutInput } = await openDates('2027-03-10', '2027-03-14');

    expect(checkOutInput).toHaveAttribute('min', '2027-03-13');
    expect(checkOutInput).toHaveAttribute('max', '2027-03-20');
    expect(
      screen.getByText('Minimum stay: 3 nights · Maximum stay: 10 nights'),
    ).toBeInTheDocument();
  });

  it('moves check-out to fit the limits when check-in changes', async () => {
    setStay('2027-03-10', '2027-03-14');
    renderWithProviders(
      <PropertyHeaderBar
        locationLabel="Lekki"
        stayLimits={{ min_nights: 3, max_nights: null }}
      />,
    );

    const { checkInInput, checkOutInput } = await openDates(
      '2027-03-10',
      '2027-03-14',
    );
    expect(checkOutInput).not.toHaveAttribute('max');

    fireEvent.change(checkInInput, { target: { value: '2027-03-13' } });

    const { checkIn, checkOut } = usePropertyBookingStore.getState();
    expect({ checkIn, checkOut }).toEqual({
      checkIn: '2027-03-13',
      checkOut: '2027-03-16',
    });
  });

  it('keeps the one-night default when no limits are given', async () => {
    setStay('2027-03-10', '2027-03-14');
    renderWithProviders(<PropertyHeaderBar locationLabel="Lekki" />);

    const { checkInInput, checkOutInput } = await openDates(
      '2027-03-10',
      '2027-03-14',
    );
    expect(checkOutInput).toHaveAttribute('min', '2027-03-11');
    expect(screen.queryByText(/Minimum stay/)).not.toBeInTheDocument();

    fireEvent.change(checkInInput, { target: { value: '2027-03-14' } });

    expect(usePropertyBookingStore.getState().checkOut).toBe('2027-03-15');
  });
});
