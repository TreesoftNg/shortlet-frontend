import {
  createCustomerAccount,
  forgotCustomerPassword,
  getCustomerMe,
  loginCustomer,
  resendCustomerOtp,
  resetCustomerPassword,
} from '@/data/api/customers';
import { ApiError } from '@/data/api/http';
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
  forgotCustomerPassword: vi.fn(),
  getCustomerMe: vi.fn(),
  loginCustomer: vi.fn(),
  resendCustomerOtp: vi.fn(),
  resetCustomerPassword: vi.fn(),
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
    });
    vi.mocked(getCustomerMe).mockResolvedValue({
      id: 'usr_1',
      email: 'ada@sunmadeapartments.com',
      firstName: 'Ada',
      lastName: 'Okafor',
      customerId: 'cus_1',
    });
    vi.mocked(forgotCustomerPassword).mockResolvedValue({});
    vi.mocked(resetCustomerPassword).mockResolvedValue({});
    vi.mocked(resendCustomerOtp).mockResolvedValue({});
  });

  it(
    'signs in against the customer login API',
    async () => {
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
      expect(getCustomerMe).toHaveBeenCalledWith('access-token');
      expect(useAuthStore.getState().accessToken).toBe('access-token');
      expect(useAuthStore.getState().user?.firstName).toBe('Ada');
      expect(push).toHaveBeenCalledWith('/account');
    },
    15_000,
  );

  it(
    'creates an account then asks for the email code',
    async () => {
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
      await user.click(screen.getByRole('button', { name: /^continue$/i }));

      expect(createCustomerAccount).toHaveBeenCalled();
      expect(
        await screen.findByText(/enter the code we sent/i),
      ).toBeInTheDocument();
    },
    15_000,
  );

  it(
    'sends unverified sign-in to the email verification step',
    async () => {
      vi.mocked(loginCustomer).mockRejectedValue(
        new ApiError({
          status: 403,
          code: 'FORBIDDEN',
          message: 'Verify your email before signing in',
        }),
      );
      const user = userEvent.setup();
      renderWithProviders(<AuthForm />);

      await user.type(
        screen.getByPlaceholderText('Email address'),
        'ada@sunmadeapartments.com',
      );
      await user.type(screen.getByLabelText('Password'), 'Sunmade-guest-1');
      await user.click(screen.getByRole('button', { name: /^continue$/i }));

      expect(resendCustomerOtp).toHaveBeenCalledWith({
        email: 'ada@sunmadeapartments.com',
      });
      expect(
        await screen.findByText(/verify your email to continue/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('6-digit code'),
      ).toBeInTheDocument();
      expect(push).not.toHaveBeenCalled();
    },
    15_000,
  );

  it(
    'resets a password with the email code',
    async () => {
      const user = userEvent.setup();
      renderWithProviders(<AuthForm />);

      await user.click(screen.getByRole('button', { name: /forgot password/i }));
      await user.type(
        screen.getByPlaceholderText('Email address'),
        'ada@sunmadeapartments.com',
      );
      await user.click(
        screen.getByRole('button', { name: /send reset code/i }),
      );

      expect(forgotCustomerPassword).toHaveBeenCalledWith({
        email: 'ada@sunmadeapartments.com',
      });
      expect(
        await screen.findByText(/choose a new password/i),
      ).toBeInTheDocument();

      await user.type(screen.getByPlaceholderText('6-digit code'), '123456');
      await user.type(screen.getByLabelText('Password'), 'New-pass-12!');
      await user.click(
        screen.getByRole('button', { name: /update password/i }),
      );

      expect(resetCustomerPassword).toHaveBeenCalledWith({
        email: 'ada@sunmadeapartments.com',
        otp: '123456',
        newPassword: 'New-pass-12!',
      });
      expect(
        await screen.findByText(/password updated/i),
      ).toBeInTheDocument();
    },
    15_000,
  );
});
