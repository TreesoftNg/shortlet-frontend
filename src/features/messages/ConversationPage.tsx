'use client';

import { ApiError } from '@/data/api/http';
import { useAuthHydrated } from '@/features/auth/hooks/useAuthHydrated';
import {
  isAuthApiError,
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { MessageComposer } from '@/features/messages/components/MessageComposer';
import { MessageThread } from '@/features/messages/components/MessageThread';
import { useMessagingSocket } from '@/features/messages/hooks/useMessagingSocket';
import {
  useConversationDetail,
  useConversationMessages,
  useMarkConversationRead,
} from '@/features/messages/hooks/useMessagesData';
import {
  AppPage,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonText,
} from '@/shared/components';
import { Box, Flex, Text } from '@chakra-ui/react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ConversationPageProps = {
  conversationId: string;
};

export function ConversationPage({ conversationId }: ConversationPageProps) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const isAuthenticated = useIsAuthenticated();
  const logout = useAuthStore((s) => s.logout);
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const detailQuery = useConversationDetail(conversationId);
  const messagesQuery = useConversationMessages(conversationId);
  const markRead = useMarkConversationRead();
  const { peerTyping, sendMessage, notifyTyping, stopTyping } =
    useMessagingSocket({
      conversationId,
      enabled: isAuthenticated,
    });

  useEffect(() => {
    if (!hydrated || isAuthenticated) return;
    router.replace('/auth');
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    const err = detailQuery.error ?? messagesQuery.error;
    if (!err || !isAuthApiError(err)) return;
    logout();
    router.replace('/auth');
  }, [detailQuery.error, logout, messagesQuery.error, router]);

  useEffect(() => {
    if (!isAuthenticated || !conversationId) return;
    markRead.mutate(conversationId);
    // Intentionally once per conversation open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, isAuthenticated]);

  async function handleSend(content: string) {
    setSendError(null);
    setSending(true);
    try {
      await sendMessage(content);
    } catch (err) {
      setSendError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not send message.',
      );
    } finally {
      setSending(false);
    }
  }

  if (!hydrated || !isAuthenticated) {
    return (
      <AppPage footer={false} mainPt={{ base: 4, md: '32px' }}>
        <SkeletonText lines={6} />
      </AppPage>
    );
  }

  const loadError = detailQuery.error ?? messagesQuery.error;
  const isPending = detailQuery.isPending || messagesQuery.isPending;
  const closed = detailQuery.data?.status === 'closed';
  const messages = messagesQuery.data?.items ?? [];

  return (
    <AppPage footer={false} mainPt={{ base: 4, md: '32px' }}>
      <Flex
        direction="column"
        h={{ base: 'calc(100dvh - 140px)', md: 'min(70vh, 720px)' }}
        minH="420px"
      >
        <Flex align="center" gap={3} pb={3} borderBottom="1px solid" borderColor="line">
          <Flex
            asChild
            align="center"
            justify="center"
            w="36px"
            h="36px"
            borderRadius="full"
            color="ink"
            _hover={{ bg: 'blackAlpha.50' }}
          >
            <Link href="/messages" aria-label="Back to messages">
              <ArrowLeft size={18} strokeWidth={1.9} />
            </Link>
          </Flex>
          <Box flex="1" minW={0}>
            <Text fontWeight="700" fontSize="16px">
              Sunmade
            </Text>
            <Text fontSize="12px" color="ink.3">
              {closed ? 'Conversation closed' : 'Usually replies within a few hours'}
            </Text>
          </Box>
          <Text
            asChild
            fontSize="13px"
            color="ink.3"
            fontWeight="600"
            flexShrink={0}
            _hover={{ color: 'ink' }}
          >
            <Link href="/trips">Trips</Link>
          </Text>
        </Flex>

        {isPending ? (
          <Box flex="1" py={4}>
            <Skeleton h="48px" mb={3} w="60%" />
            <Flex justify="flex-end" mb={3}>
              <Skeleton h="48px" w="50%" />
            </Flex>
            <Skeleton h="48px" w="55%" />
          </Box>
        ) : null}

        {!isPending && loadError && !isAuthApiError(loadError) ? (
          <ErrorState
            title="Couldn’t load conversation"
            description={
              loadError instanceof ApiError
                ? loadError.message
                : 'Try again in a moment.'
            }
            onRetry={() => {
              void detailQuery.refetch();
              void messagesQuery.refetch();
            }}
            compact
            mt={4}
          />
        ) : null}

        {!isPending && !loadError && messages.length === 0 ? (
          <EmptyState
            title="Say hello"
            description="Ask about availability, check-in, or anything else for this stay."
            icon={<MessageCircle size={22} strokeWidth={1.9} />}
            compact
            mt={6}
          />
        ) : null}

        {!isPending && !loadError && messages.length > 0 ? (
          <MessageThread
            messages={messages}
            currentUserId={userId}
            peerTyping={peerTyping}
          />
        ) : (
          <Box flex="1" />
        )}

        {sendError ? (
          <Text color="red.500" fontSize="13px" mb={2}>
            {sendError}
          </Text>
        ) : null}

        <MessageComposer
          disabled={closed || Boolean(loadError)}
          sending={sending}
          onSend={handleSend}
          onTyping={notifyTyping}
          onStopTyping={stopTyping}
        />
      </Flex>
    </AppPage>
  );
}
