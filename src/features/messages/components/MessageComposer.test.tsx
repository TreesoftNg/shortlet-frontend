import { MessageComposer } from '@/features/messages/components/MessageComposer';
import { renderWithProviders } from '@/test/render';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('MessageComposer', () => {
  it('keeps Send disabled while the field is empty', () => {
    renderWithProviders(<MessageComposer onSend={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('sends trimmed content and clears the field', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<MessageComposer onSend={onSend} />);

    await user.type(
      screen.getByPlaceholderText('Write a message…'),
      '  Hello there  ',
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(onSend).toHaveBeenCalledWith('Hello there');
    expect(screen.getByPlaceholderText('Write a message…')).toHaveValue('');
  });
});
