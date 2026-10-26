import { ConversationList } from '@/features/messages/components/ConversationList';
import type { ConversationListItem } from '@/data/types/messaging';
import { renderWithProviders } from '@/test/render';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const emptyList: ConversationListItem[] = [];

const sample: ConversationListItem = {
  id: '11111111-1111-4111-8111-111111111111',
  status: 'open',
  customer: {
    id: 'cust-1',
    firstName: 'Ada',
    lastName: 'Okafor',
    email: 'ada@example.com',
  },
  propertyId: null,
  unitId: null,
  bookingId: null,
  propertyName: null,
  unitName: null,
  contextLabel: null,
  lastMessageAt: '2026-10-12T10:00:00.000Z',
  lastMessagePreview: 'Can I check in early?',
  lastMessageSenderType: 'customer',
  unreadCount: 2,
  closedAt: null,
  createdAt: '2026-10-12T09:00:00.000Z',
  updatedAt: '2026-10-12T10:00:00.000Z',
};

describe('ConversationList', () => {
  it('renders nothing actionable when empty', () => {
    const { container } = renderWithProviders(
      <ConversationList conversations={emptyList} />,
    );
    expect(container.querySelectorAll('li')).toHaveLength(0);
  });

  it('shows preview, host name, context, and unread count', () => {
    renderWithProviders(<ConversationList conversations={[sample]} />);
    expect(screen.getByText('Sunmade')).toBeInTheDocument();
    expect(screen.getByText('General chat')).toBeInTheDocument();
    expect(screen.getByText('Can I check in early?')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/messages/${sample.id}`,
    );
  });

  it('prefers the API context label for unit/property', () => {
    renderWithProviders(
      <ConversationList
        conversations={[
          {
            ...sample,
            propertyId: 'prop-1',
            unitId: 'unit-1',
            bookingId: 'booking-1',
            propertyName: 'Azure Lekki',
            unitName: 'Studio A',
            contextLabel: 'Azure Lekki · Studio A',
          },
        ]}
      />,
    );
    expect(screen.getByText('Azure Lekki · Studio A')).toBeInTheDocument();
    expect(screen.queryByText('About your stay')).not.toBeInTheDocument();
  });
});
