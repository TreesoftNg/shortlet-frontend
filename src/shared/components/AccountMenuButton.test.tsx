import { useAuthStore } from '@/features/auth/store/auth-store';
import { AccountMenuButton } from '@/shared/components/AccountMenuButton';
import { renderWithProviders } from '@/test/render';
import { act, screen } from '@testing-library/react';
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

describe('AccountMenuButton', () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.setState({ user: null });
    });
    localStorage.clear();
  });

  it('links the mobile avatar to sign in when logged out', () => {
    renderWithProviders(<AccountMenuButton />);

    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/auth',
    );
  });

  it('links the mobile avatar to account when signed in', () => {
    act(() => {
      useAuthStore.getState().login('guest@example.com');
    });

    renderWithProviders(<AccountMenuButton />);

    expect(
      screen.getByRole('link', { name: /your account/i }),
    ).toHaveAttribute('href', '/account');
  });

  it('opens the desktop menu with guest actions when logged out', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccountMenuButton />);

    await user.click(
      screen.getByRole('button', { name: 'Account menu', hidden: true }),
    );

    expect(
      await screen.findByRole('menuitem', { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /explore stays/i }),
    ).toBeInTheDocument();
  });

  it('opens the desktop menu with account and log out when signed in', async () => {
    const user = userEvent.setup();
    act(() => {
      useAuthStore.getState().login('guest@example.com');
    });

    renderWithProviders(<AccountMenuButton />);
    await user.click(
      screen.getByRole('button', { name: 'Account menu', hidden: true }),
    );

    expect(
      await screen.findByRole('menuitem', { name: /^account$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /log out/i }),
    ).toBeInTheDocument();
  });
});
