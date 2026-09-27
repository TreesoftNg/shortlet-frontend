import { AppButton } from '@/shared/components/ui/AppButton';
import { renderWithProviders } from '@/test/render';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

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

describe('AppButton', () => {
  it('renders children and handles clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderWithProviders(<AppButton onClick={onClick}>Continue</AppButton>);

    const button = screen.getByRole('button', { name: 'Continue' });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a link when href is provided', () => {
    renderWithProviders(
      <AppButton href="/search" variant="outline">
        Explore
      </AppButton>,
    );

    const link = screen.getByRole('link', { name: 'Explore' });
    expect(link).toHaveAttribute('href', '/search');
  });
});
