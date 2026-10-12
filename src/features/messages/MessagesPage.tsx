'use client';

import { createConversation } from '@/data/api/conversations';
import { ApiError } from '@/data/api/http';
import { queryKeys } from '@/data/query-keys';
import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import {
  isAuthApiError,
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { ConversationList } from '@/features/messages/components/ConversationList';
import { useConversations } from '@/features/messages/hooks/useMessagesData';
import {
  AppButton,
  AppPage,
  EmptyState,
  ErrorState,
  PageHero,
  Skeleton,
  SkeletonText,
} from '@/shared/components';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function MessagesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hydrated = useAuthHydrated();
  const isAuthenticated = useIsAuthenticated();
  const logout = useAuthStore((s) => s.logout);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const {
    data: conversations = [],
    isPending,
    isError,
    error,
    refetch,
  } = useConversations();

  useEffect(() => {
    if (!hydrated || isAuthenticated) return;
    router.replace('/auth');
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (!error || !isAuthApiError(error)) return;
    logout();
    router.replace('/auth');
  }, [error, logout, router]);

  async function handleStartChat() {
    setStartError(null);
    // Reuse the newest open general thread so "New chat" does not spawn twins.
    const existingGeneral = conversations
      .filter(
        (c) =>
          c.status === 'open' &&
          !c.bookingId &&
          !c.propertyId &&
          !c.unitId,
      )
      .sort((a, b) => {
        const aAt = a.lastMessageAt ?? a.updatedAt;
        const bAt = b.lastMessageAt ?? b.updatedAt;
        return bAt.localeCompare(aAt);
      })[0];
    if (existingGeneral) {
      router.push(`/messages/${existingGeneral.id}`);
      return;
    }

    setStarting(true);
    try {
      const token = useAuthStore.getState().getValidAccessToken();
      if (!token) {
        router.replace('/auth');
        return;
      }
      const created = await createConversation({}, token);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.conversations(),
      });
      router.push(`/messages/${created.id}`);
    } catch (err) {
      setStartError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not start a conversation.',
      );
    } finally {
      setStarting(false);
    }
  }

  if (!hydrated || !isAuthenticated) {
    return (
      <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
        <PageHero title="Messages" size="app" mb={0} maxW="none" />
        <SkeletonText noOfLines={4} mt={6} />
      </AppPage>
    );
  }

  return (
    <AppPage footer={false} mainPt={{ base: 6, md: '44px' }}>
      <Flex justify="space-between" align="flex-end" gap={4} mb={2}>
        <PageHero title="Messages" size="app" mb={0} maxW="none" />
        <AppButton
          size="sm"
          onClick={() => void handleStartChat()}
          disabled={starting}
        >
          {starting ? 'Starting…' : 'New chat'}
        </AppButton>
      </Flex>

      {startError ? (
        <Text color="red.500" fontSize="13px" mb={3}>
          {startError}
        </Text>
      ) : null}

      {isPending ? (
        <Box mt={4}>
          <Skeleton h="64px" mb={3} />
          <Skeleton h="64px" mb={3} />
          <Skeleton h="64px" />
        </Box>
      ) : null}

      {isError && !isAuthApiError(error) ? (
        <ErrorState
          title="Couldn’t load messages"
          description={
            error instanceof ApiError
              ? error.message
              : 'Your conversations are temporarily unavailable.'
          }
          onRetry={() => void refetch()}
          compact
          mt={4}
        />
      ) : null}

      {!isPending && !isError && conversations.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="Ask about a stay, a booking, or anything else — we’ll reply here."
          actionLabel={starting ? 'Starting…' : 'Message Sunmade'}
          onAction={() => void handleStartChat()}
          icon={<MessageCircle size={22} strokeWidth={1.9} />}
          compact
          mt={4}
        />
      ) : null}

      {!isPending && !isError && conversations.length > 0 ? (
        <Box mt={2}>
          <ConversationList conversations={conversations} />
        </Box>
      ) : null}
    </AppPage>
  );
}
