import type {
  ConversationListItem,
  ConversationMessage,
  UnreadCount,
} from '@/data/types/messaging';

/** Append or replace a message by id / clientMessageId (oldest → newest). */
export function mergeMessageIntoThread(
  existing: ConversationMessage[] | undefined,
  incoming: ConversationMessage,
): ConversationMessage[] {
  const list = existing ? [...existing] : [];
  const byId = list.findIndex((m) => m.id === incoming.id);
  if (byId >= 0) {
    list[byId] = incoming;
    return list;
  }
  if (incoming.clientMessageId) {
    const byClient = list.findIndex(
      (m) => m.clientMessageId === incoming.clientMessageId,
    );
    if (byClient >= 0) {
      list[byClient] = incoming;
      return list;
    }
  }
  list.push(incoming);
  list.sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() ||
      a.id.localeCompare(b.id),
  );
  return list;
}

/** Update list preview / unread after a new message. */
export function applyMessageToConversationList(
  list: ConversationListItem[] | undefined,
  message: ConversationMessage,
  opts: { incrementUnread: boolean; clearUnread?: boolean },
): ConversationListItem[] | undefined {
  // Do not seed an empty inbox — callers should invalidate and refetch instead.
  if (!list) return undefined;
  const rows = [...list];
  const index = rows.findIndex((c) => c.id === message.conversationId);
  if (index < 0) return rows;

  const current = rows[index]!;
  let unreadCount = current.unreadCount;
  if (opts.clearUnread) {
    unreadCount = 0;
  } else if (opts.incrementUnread) {
    unreadCount = current.unreadCount + 1;
  }

  const updated: ConversationListItem = {
    ...current,
    lastMessageAt: message.createdAt,
    lastMessagePreview: message.content,
    lastMessageSenderType: message.senderType,
    unreadCount,
    updatedAt: message.createdAt,
  };
  rows.splice(index, 1);
  rows.unshift(updated);
  return rows;
}

export function clearConversationUnread(
  list: ConversationListItem[] | undefined,
  conversationId: string,
): ConversationListItem[] | undefined {
  // Returning [] here used to fake an empty inbox when mark-read ran before
  // /messages had ever fetched the list (booking → chat → back).
  if (!list) return undefined;
  return list.map((c) =>
    c.id === conversationId ? { ...c, unreadCount: 0 } : c,
  );
}

export function applyUnreadTotals(
  previous: UnreadCount | undefined,
  next: Partial<UnreadCount>,
): UnreadCount {
  return {
    unreadConversations:
      next.unreadConversations ?? previous?.unreadConversations ?? 0,
    unreadMessages: next.unreadMessages ?? previous?.unreadMessages ?? 0,
  };
}

/** Drop one conversation's unread from the global badge totals. */
export function subtractConversationFromUnreadTotals(
  totals: UnreadCount | undefined,
  conversationUnread: number,
): UnreadCount {
  const prev = totals ?? { unreadConversations: 0, unreadMessages: 0 };
  if (conversationUnread <= 0) return prev;
  return {
    unreadConversations: Math.max(0, prev.unreadConversations - 1),
    unreadMessages: Math.max(0, prev.unreadMessages - conversationUnread),
  };
}
