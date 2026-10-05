import {
  createCustomerAccount,
  loginCustomer,
} from '@/data/api/customers';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { renderWithProviders } from '@/test/render';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));

vi.mock('@/data/api/customers', () => ({
  createCustomerAccount: vi.fn(),
  loginCustomer: vi.fn(),
  resendCustomerOtp: vi.fn(),
  verifyCustomerOtp: vi.fn(),
}));

describe('AuthForm', () => {
  beforeEach(() => {
    push.mockReset();
    act(() => {
      useAuthStore.getState().logout();
    });
    vi.mocked(loginCustomer).mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      profile: {
        user: {
          id: 'usr_1',
          email: 'ada@sunmadeapartments.com',
          firstName: 'Ada',
          lastName: 'Okafor',
        },
      },
    });
  });

  it('signs in against the customer login API', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthForm />);

    await user.type(
      screen.getByPlaceholderText('Email address'),
      'ada@sunmadeapartments.com',
    );
    await user.type(screen.getByLabelText('Password'), 'Sunmade-guest-1');
    await user.click(screen.getByRole('button', { name: /^continue$/i }));

    expect(loginCustomer).toHaveBeenCalledWith({
      email: 'ada@sunmadeapartments.com',
      password: 'Sunmade-guest-1',
    });
    expect(useAuthStore.getState().accessToken).toBe('access-token');
    expect(useAuthStore.getState().user?.firstName).toBe('Ada');
    expect(push).toHaveBeenCalledWith('/account');
  });

  it('creates an account then asks for the email code', async () => {
    vi.mocked(createCustomerAccount).mockResolvedValue({});
    const user = userEvent.setup();
    renderWithProviders(<AuthForm />);

    await user.click(screen.getByRole('button', { name: /create account/i }));
    await user.type(screen.getByPlaceholderText('First name'), 'Ada');
    await user.type(screen.getByPlaceholderText('Last name'), 'Okafor');
    await user.type(
      screen.getByPlaceholderText('Email address'),
      'ada@sunmadeapartments.com',
    );
    await user.type(screen.getByLabelText('Password'), 'Sunmade-guest-1');
    await user.type(
      screen.getByLabelText('Confirm password'),
      'Sunmade-guest-1',
    );
    await user.click(screen.getByRole('button', { name: /^continue$/i }));

    expect(createCustomerAccount).toHaveBeenCalled();
    expect(
      await screen.findByText(/enter the code we sent/i),
    ).toBeInTheDocument();
  });
});
