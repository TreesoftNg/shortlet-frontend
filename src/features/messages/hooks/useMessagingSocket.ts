'use client';

import {
  markConversationRead,
  sendConversationMessage,
} from '@/data/api/conversations';
import {
  applyMessageToConversationList,
  applyUnreadTotals,
  clearConversationUnread,
  mergeMessageIntoThread,
  subtractConversationFromUnreadTotals,
} from '@/data/lib/messaging-cache';
import { queryKeys } from '@/data/query-keys';
import type {
  ConversationListItem,
  ConversationMessage,
  MessagePage,
  UnreadCount,
} from '@/data/types/messaging';
import { isAccessTokenExpired } from '@/features/auth/lib/access-token';
import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import {
  disconnectMessagingSocket,
  getMessagingSocket,
  joinConversation,
  leaveConversation,
  markReadViaSocket,
  sendMessageViaSocket,
  typingStart,
  typingStop,
} from '@/features/messages/lib/messaging-socket';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';

function newClientMessageId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

let socketSubscribers = 0;

/**
 * Keeps a customer messaging socket alive while authenticated.
 * Patches React Query caches from realtime events.
 */
export function useMessagingSocket(options: {
  conversationId?: string | null;
  enabled?: boolean;
} = {}) {
  const { conversationId = null, enabled = true } = options;
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();
  const accessToken = useAuthStore((s) => {
    if (!s.accessToken) return null;
    if (isAccessTokenExpired(s.accessToken, s.accessTokenExpiresAt)) {
      return null;
    }
    return s.accessToken;
  });
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const [ready, setReady] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const joinedId = useRef<string | null>(null);
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  const markReadInFlight = useRef<Set<string>>(new Set());

  const clearLocalUnread = useCallback(
    (id: string) => {
      const list = queryClient.getQueryData<ConversationListItem[]>(
        queryKeys.messages.conversations(),
      );
      const prior = list?.find((c) => c.id === id)?.unreadCount ?? 0;
      if (list) {
        queryClient.setQueryData<ConversationListItem[]>(
          queryKeys.messages.conversations(),
          (prev) => clearConversationUnread(prev, id),
        );
      }
      if (prior > 0) {
        queryClient.setQueryData<UnreadCount>(
          queryKeys.messages.unread(),
          (prev) => subtractConversationFromUnreadTotals(prev, prior),
        );
      }
    },
    [queryClient],
  );

  const persistMarkRead = useCallback(
    async (id: string) => {
      if (markReadInFlight.current.has(id)) return;
      markReadInFlight.current.add(id);
      clearLocalUnread(id);
      try {
        const socket = socketRef.current;
        if (socket?.connected) {
          try {
            await markReadViaSocket(socket, id);
            clearLocalUnread(id);
            return;
          } catch {
            // Fall through to REST.
          }
        }
        const { ensureAccessToken } = await import(
          '@/features/auth/lib/refresh-session'
        );
        const token = await ensureAccessToken();
        if (!token) return;
        await markConversationRead(id, token);
        clearLocalUnread(id);
      } catch {
        // Optimistic clear stays; next unread fetch reconciles.
      } finally {
        markReadInFlight.current.delete(id);
      }
    },
    [clearLocalUnread],
  );

  const patchMessageCaches = useCallback(
    (message: ConversationMessage) => {
      const activeId = conversationIdRef.current;
      const currentUserId = userIdRef.current;
      const isOwn =
        message.senderType === 'customer' ||
        (Boolean(currentUserId) && message.senderUserId === currentUserId);
      const isActive = message.conversationId === activeId;

      queryClient.setQueryData<MessagePage>(
        queryKeys.messages.thread(message.conversationId),
        (prev) => {
          if (!prev) {
            return {
              items: [message],
              nextBefore: null,
              hasMore: false,
            };
          }
          return {
            ...prev,
            items: mergeMessageIntoThread(prev.items, message),
          };
        },
      );
      const listKey = queryKeys.messages.conversations();
      const cachedList =
        queryClient.getQueryData<ConversationListItem[]>(listKey);
      if (cachedList === undefined) {
        void queryClient.invalidateQueries({ queryKey: listKey });
      } else {
        queryClient.setQueryData<ConversationListItem[]>(listKey, (prev) =>
          applyMessageToConversationList(prev, message, {
            incrementUnread: !isOwn && !isActive,
            clearUnread: isActive && !isOwn,
          }),
        );
      }

      if (!isOwn && isActive) {
        void persistMarkRead(message.conversationId);
      }
    },
    [persistMarkRead, queryClient],
  );

  useEffect(() => {
    if (!enabled || !isAuthenticated || !accessToken) {
      return;
    }

    socketSubscribers += 1;
    const socket = getMessagingSocket(accessToken);
    if (!socket) {
      socketSubscribers = Math.max(0, socketSubscribers - 1);
      return;
    }
    socketRef.current = socket;

    const onReady = () => {
      setReady(true);
      // Catch up on anything sent while the socket was down. Without
      // cancelRefetch a second subscriber joins the same request.
      void queryClient.invalidateQueries(
        { queryKey: queryKeys.messages.all },
        { cancelRefetch: false },
      );
    };
    const onError = () => setReady(false);
    const onDisconnect = () => setReady(false);

    const onMessageNew = (message: ConversationMessage) => {
      patchMessageCaches(message);
    };

    const onMessageRead = (payload: { conversationId: string }) => {
      clearLocalUnread(payload.conversationId);
    };

    const onUnread = (payload: {
      forKind: string;
      unreadConversations: number;
      unreadMessages: number;
      conversationId: string;
      customerUnreadCount: number;
    }) => {
      if (payload.forKind !== 'customer') return;
      const viewing = payload.conversationId === conversationIdRef.current;

      if (viewing) {
        clearLocalUnread(payload.conversationId);
        if (payload.customerUnreadCount > 0) {
          void persistMarkRead(payload.conversationId);
        }
        return;
      }

      queryClient.setQueryData<UnreadCount>(
        queryKeys.messages.unread(),
        (prev) =>
          applyUnreadTotals(prev, {
            unreadConversations: payload.unreadConversations,
            unreadMessages: payload.unreadMessages,
          }),
      );
      queryClient.setQueryData<ConversationListItem[]>(
        queryKeys.messages.conversations(),
        (prev) => {
          if (!prev) return prev;
          return prev.map((c) =>
            c.id === payload.conversationId
              ? { ...c, unreadCount: payload.customerUnreadCount }
              : c,
          );
        },
      );
    };

    const onTypingStart = (payload: {
      conversationId: string;
      userId: string;
      kind: string;
    }) => {
      if (
        payload.conversationId === conversationIdRef.current &&
        payload.kind === 'staff' &&
        payload.userId !== userIdRef.current
      ) {
        setPeerTyping(true);
      }
    };

    const onTypingStop = (payload: {
      conversationId: string;
      userId: string;
    }) => {
      if (
        payload.conversationId === conversationIdRef.current &&
        payload.userId !== userIdRef.current
      ) {
        setPeerTyping(false);
      }
    };

    socket.on('connection:ready', onReady);
    socket.on('connection:error', onError);
    socket.on('disconnect', onDisconnect);
    socket.on('message:new', onMessageNew);
    socket.on('message:read', onMessageRead);
    socket.on('unread:update', onUnread);
    socket.on('typing:start', onTypingStart);
    socket.on('typing:stop', onTypingStop);

    if (socket.connected) setReady(true);

    return () => {
      socket.off('connection:ready', onReady);
      socket.off('connection:error', onError);
      socket.off('disconnect', onDisconnect);
      socket.off('message:new', onMessageNew);
      socket.off('message:read', onMessageRead);
      socket.off('unread:update', onUnread);
      socket.off('typing:start', onTypingStart);
      socket.off('typing:stop', onTypingStop);
      socketRef.current = null;
      setReady(false);
      socketSubscribers = Math.max(0, socketSubscribers - 1);
      if (socketSubscribers === 0) {
        disconnectMessagingSocket();
      }
    };
  }, [
    accessToken,
    clearLocalUnread,
    enabled,
    isAuthenticated,
    patchMessageCaches,
    persistMarkRead,
    queryClient,
  ]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !ready || !conversationId) return;

    let cancelled = false;
    const previous = joinedId.current;

    void persistMarkRead(conversationId);

    void (async () => {
      try {
        if (previous && previous !== conversationId) {
          await leaveConversation(socket, previous);
        }
        await joinConversation(socket, conversationId);
        if (cancelled) return;
        joinedId.current = conversationId;
      } catch {
        // REST mark-read still works from the page hook.
      }
    })();

    return () => {
      cancelled = true;
      setPeerTyping(false);
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
      }
      if (joinedId.current === conversationId) {
        void leaveConversation(socket, conversationId).catch(() => undefined);
        joinedId.current = null;
      }
    };
  }, [conversationId, persistMarkRead, ready]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId) throw new Error('No conversation selected');
      const trimmed = content.trim();
      if (!trimmed) throw new Error('Message is empty');

      const clientMessageId = newClientMessageId();
      const optimistic: ConversationMessage = {
        id: `temp-${clientMessageId}`,
        conversationId,
        senderUserId: userId ?? '',
        senderType: 'customer',
        senderName: null,
        content: trimmed,
        messageType: 'text',
        status: 'sent',
        clientMessageId,
        readAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      patchMessageCaches(optimistic);

      const socket =
        socketRef.current ?? getMessagingSocket(accessToken ?? undefined);
      try {
        if (socket?.connected) {
          const result = await sendMessageViaSocket(socket, {
            conversationId,
            content: trimmed,
            clientMessageId,
          });
          patchMessageCaches(result.message);
          return result.message;
        }
      } catch {
        // Fall through to REST.
      }

      const { ensureAccessToken } = await import(
        '@/features/auth/lib/refresh-session'
      );
      const token = await ensureAccessToken();
      if (!token) throw new Error('Sign in to send messages');
      const saved = await sendConversationMessage(
        conversationId,
        { content: trimmed, clientMessageId },
        token,
      );
      patchMessageCaches(saved);
      return saved;
    },
    [accessToken, conversationId, patchMessageCaches, userId],
  );

  const notifyTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !conversationId) return;
    void typingStart(socket, conversationId).catch(() => undefined);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      void typingStop(socket, conversationId).catch(() => undefined);
    }, 2_500);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !conversationId) return;
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
      typingTimer.current = null;
    }
    void typingStop(socket, conversationId).catch(() => undefined);
  }, [conversationId]);

  return {
    ready,
    peerTyping,
    sendMessage,
    notifyTyping,
    stopTyping,
  };
}
