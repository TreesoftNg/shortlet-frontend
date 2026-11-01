'use client';

import type { ConversationListItem } from '@/data/types/messaging';
import { Box, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';

function formatPreviewTime(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function conversationContextLabel(conversation: ConversationListItem): string {
  if (conversation.contextLabel) return conversation.contextLabel;
  if (conversation.bookingId) return 'About your stay';
  if (conversation.propertyId || conversation.unitId) return 'Property inquiry';
  return 'General chat';
}

type ConversationListProps = {
  conversations: ConversationListItem[];
  activeId?: string | null;
};

export function ConversationList({
  conversations,
  activeId,
}: ConversationListProps) {
  return (
    <Box as="ul" listStyleType="none" m={0} p={0}>
      {conversations.map((conversation) => {
        const active = conversation.id === activeId;
        const unread = conversation.unreadCount > 0;
        return (
          <Box as="li" key={conversation.id}>
            <Flex
              asChild
              align="flex-start"
              gap={3}
              px={1}
              py={3}
              borderBottom="1px solid"
              borderColor="line"
              bg={active ? 'brand.50' : 'transparent'}
              _hover={{ bg: active ? 'brand.50' : 'blackAlpha.50' }}
            >
              <Link href={`/messages/${conversation.id}`}>
                <Flex
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg="brand.500"
                  color="white"
                  align="center"
                  justify="center"
                  fontSize="13px"
                  fontWeight="700"
                  flexShrink={0}
                >
                  S
                </Flex>
                <Box flex="1" minW={0}>
                  <Flex justify="space-between" gap={2} align="baseline">
                    <Text
                      fontWeight={unread ? '700' : '600'}
                      fontSize="15px"
                      truncate
                    >
                      Sunmade
                    </Text>
                    <Text
                      fontSize="12px"
                      color="ink.3"
                      flexShrink={0}
                    >
                      {formatPreviewTime(conversation.lastMessageAt)}
                    </Text>
                  </Flex>
                  <Text fontSize="12px" color="ink.3" truncate mt="1px">
                    {conversationContextLabel(conversation)}
                  </Text>
                  <Flex justify="space-between" gap={2} mt="2px">
                    <Text
                      fontSize="13px"
                      color={unread ? 'ink' : 'ink.2'}
                      fontWeight={unread ? '600' : '400'}
                      truncate
                    >
                      {conversation.lastMessagePreview ?? 'No messages yet'}
                    </Text>
                    {unread ? (
                      <Flex
                        minW="20px"
                        h="20px"
                        px="6px"
                        borderRadius="full"
                        bg="brand.500"
                        color="white"
                        align="center"
                        justify="center"
                        fontSize="11px"
                        fontWeight="700"
                        flexShrink={0}
                      >
                        {conversation.unreadCount > 99
                          ? '99+'
                          : conversation.unreadCount}
                      </Flex>
                    ) : null}
                  </Flex>
                </Box>
              </Link>
            </Flex>
          </Box>
        );
      })}
    </Box>
  );
}
