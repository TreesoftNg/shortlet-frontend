import { describe, expect, it } from 'vitest';
import {
  applyMessageToConversationList,
  clearConversationUnread,
  mergeMessageIntoThread,
  subtractConversationFromUnreadTotals,
} from '@/data/lib/messaging-cache';
import type {
  ConversationListItem,
  ConversationMessage,
} from '@/data/types/messaging';

function message(
  overrides: Partial<ConversationMessage> = {},
): ConversationMessage {
  return {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderUserId: 'user-1',
    senderType: 'customer',
    senderName: 'Ada',
    content: 'Hello',
    messageType: 'text',
    status: 'sent',
    clientMessageId: null,
    readAt: null,
    createdAt: '2026-10-12T10:00:00.000Z',
    updatedAt: '2026-10-12T10:00:00.000Z',
    ...overrides,
  };
}

function conversation(
  overrides: Partial<ConversationListItem> = {},
): ConversationListItem {
  return {
    id: 'conv-1',
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
    lastMessageAt: null,
    lastMessagePreview: null,
    lastMessageSenderType: null,
    unreadCount: 0,
    closedAt: null,
    createdAt: '2026-10-12T09:00:00.000Z',
    updatedAt: '2026-10-12T09:00:00.000Z',
    ...overrides,
  };
}

describe('messaging-cache', () => {
  it('replaces optimistic messages by clientMessageId', () => {
    const optimistic = message({
      id: 'temp-abc',
      clientMessageId: 'abc',
      content: 'Hello',
    });
    const saved = message({
      id: 'msg-real',
      clientMessageId: 'abc',
      content: 'Hello',
    });

    const merged = mergeMessageIntoThread([optimistic], saved);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.id).toBe('msg-real');
  });

  it('appends and sorts messages chronologically', () => {
    const older = message({
      id: 'msg-a',
      createdAt: '2026-10-12T09:00:00.000Z',
    });
    const newer = message({
      id: 'msg-b',
      createdAt: '2026-10-12T11:00:00.000Z',
      content: 'Later',
    });

    const merged = mergeMessageIntoThread([newer], older);
    expect(merged.map((m) => m.id)).toEqual(['msg-a', 'msg-b']);
  });

  it('moves an updated conversation to the top and bumps unread', () => {
    const list = [
      conversation({ id: 'conv-2', unreadCount: 0 }),
      conversation({ id: 'conv-1', unreadCount: 1 }),
    ];
    const incoming = message({
      conversationId: 'conv-1',
      content: 'New reply',
      senderType: 'staff',
      createdAt: '2026-10-12T12:00:00.000Z',
    });

    const next = applyMessageToConversationList(list, incoming, {
      incrementUnread: true,
    });
    expect(next[0]?.id).toBe('conv-1');
    expect(next[0]?.unreadCount).toBe(2);
    expect(next[0]?.lastMessagePreview).toBe('New reply');
  });

  it('clears unread for one conversation', () => {
    const list = [
      conversation({ id: 'conv-1', unreadCount: 4 }),
      conversation({ id: 'conv-2', unreadCount: 1 }),
    ];
    expect(clearConversationUnread(list, 'conv-1')[0]?.unreadCount).toBe(0);
    expect(clearConversationUnread(list, 'conv-1')[1]?.unreadCount).toBe(1);
  });

  it('clears unread when the open thread gets a staff reply', () => {
    const list = [conversation({ unreadCount: 3 })];
    const next = applyMessageToConversationList(
      list,
      message({ senderType: 'staff', content: 'On it' }),
      { incrementUnread: false, clearUnread: true },
    );
    expect(next[0]?.unreadCount).toBe(0);
  });

  it('subtracts a conversation from badge totals', () => {
    expect(
      subtractConversationFromUnreadTotals(
        { unreadConversations: 2, unreadMessages: 5 },
        3,
      ),
    ).toEqual({ unreadConversations: 1, unreadMessages: 2 });
  });
});
