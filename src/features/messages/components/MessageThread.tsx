'use client';

import type { ConversationMessage } from '@/data/types/messaging';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';

type MessageThreadProps = {
  messages: ConversationMessage[];
  currentUserId: string | null;
  peerTyping?: boolean;
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function MessageThread({
  messages,
  currentUserId,
  peerTyping = false,
}: MessageThreadProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, peerTyping]);

  return (
    <Flex direction="column" gap={3} flex="1" overflowY="auto" py={2} minH={0}>
      {messages.map((message) => {
        const mine =
          message.senderType === 'customer' ||
          message.senderUserId === currentUserId;
        const pending = message.id.startsWith('temp-');
        return (
          <Flex
            key={message.id}
            justify={mine ? 'flex-end' : 'flex-start'}
          >
            <Box
              maxW={{ base: '85%', md: '70%' }}
              bg={mine ? 'brand.500' : 'blackAlpha.50'}
              color={mine ? 'white' : 'ink'}
              px={3.5}
              py={2.5}
              borderRadius="18px"
              borderBottomRightRadius={mine ? '6px' : '18px'}
              borderBottomLeftRadius={mine ? '18px' : '6px'}
              opacity={pending ? 0.7 : 1}
            >
              <Text fontSize="14px" whiteSpace="pre-wrap" lineHeight="1.45">
                {message.content}
              </Text>
              <Text
                fontSize="11px"
                mt={1}
                opacity={0.75}
                textAlign="right"
              >
                {formatTime(message.createdAt)}
              </Text>
            </Box>
          </Flex>
        );
      })}
      {peerTyping ? (
        <Text fontSize="13px" color="ink.3" px={1}>
          Sunmade is typing…
        </Text>
      ) : null}
      <Box ref={endRef} />
    </Flex>
  );
}
