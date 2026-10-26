'use client';

import {
  getConversation,
  getUnreadCount,
  listConversations,
  listMessages,
  markConversationRead,
} from '@/data/api/conversations';
import {
  clearConversationUnread,
  subtractConversationFromUnreadTotals,
} from '@/data/lib/messaging-cache';
import { queryKeys } from '@/data/query-keys';
import type {
  ConversationListItem,
  UnreadCount,
} from '@/data/types/messaging';
import { useValidAccessToken } from '@/features/auth/hooks/useValidAccessToken';
import { ensureAccessToken } from '@/features/auth/lib/refresh-session';
import { useIsAuthenticated } from '@/features/auth/store/auth-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const readOptions = {
  staleTime: 30_000,
} as const;

export function useConversations() {
  const accessToken = useValidAccessToken();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: queryKeys.messages.conversations(),
    queryFn: () => listConversations(accessToken!, { limit: 50 }),
    enabled: isAuthenticated && Boolean(accessToken),
    ...readOptions,
    // Always reload when opening the inbox so a prior mark-read / socket
    // patch cannot leave a stale empty list after booking → chat → back.
    refetchOnMount: 'always',
  });
}

export function useUnreadCount() {
  const accessToken = useValidAccessToken();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: queryKeys.messages.unread(),
    queryFn: () => getUnreadCount(accessToken!),
    enabled: isAuthenticated && Boolean(accessToken),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useConversationDetail(conversationId: string | null) {
  const accessToken = useValidAccessToken();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: queryKeys.messages.detail(conversationId ?? 'none'),
    queryFn: () => getConversation(conversationId!, accessToken!),
    enabled: isAuthenticated && Boolean(accessToken) && Boolean(conversationId),
    ...readOptions,
  });
}

export function useConversationMessages(conversationId: string | null) {
  const accessToken = useValidAccessToken();
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: queryKeys.messages.thread(conversationId ?? 'none'),
    queryFn: () => listMessages(conversationId!, accessToken!, { limit: 40 }),
    enabled: isAuthenticated && Boolean(accessToken) && Boolean(conversationId),
    ...readOptions,
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const token = await ensureAccessToken();
      if (!token) throw new Error('Sign in required');
      return markConversationRead(conversationId, token);
    },
    onMutate: async (conversationId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.messages.conversations(),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.messages.unread(),
      });
      const list = queryClient.getQueryData<ConversationListItem[]>(
        queryKeys.messages.conversations(),
      );
      const prior = list?.find((c) => c.id === conversationId)?.unreadCount ?? 0;
      if (list) {
        queryClient.setQueryData<ConversationListItem[]>(
          queryKeys.messages.conversations(),
          (prev) => clearConversationUnread(prev, conversationId),
        );
      }
      if (prior > 0) {
        queryClient.setQueryData<UnreadCount>(
          queryKeys.messages.unread(),
          (prev) => subtractConversationFromUnreadTotals(prev, prior),
        );
      }
    },
    onSuccess: (detail, conversationId) => {
      queryClient.setQueryData<ConversationListItem[]>(
        queryKeys.messages.conversations(),
        (prev) => {
          if (!prev) return prev;
          return prev.map((c) =>
            c.id === conversationId
              ? { ...c, unreadCount: detail.unreadCount }
              : c,
          );
        },
      );
      queryClient.setQueryData(
        queryKeys.messages.detail(conversationId),
        detail,
      );
      // Refresh totals from server so the nav badge stays accurate.
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.unread(),
      });
    },
  });
}
