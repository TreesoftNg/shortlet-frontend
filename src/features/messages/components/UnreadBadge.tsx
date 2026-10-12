'use client';

import { useUnreadCount } from '@/features/messages/hooks/useMessagesData';
import { useIsAuthenticated } from '@/features/auth/store/auth-store';
import { Box } from '@chakra-ui/react';

export function UnreadBadge() {
  const isAuthenticated = useIsAuthenticated();
  const { data } = useUnreadCount();
  const count = isAuthenticated ? (data?.unreadConversations ?? 0) : 0;
  if (count <= 0) return null;

  return (
    <Box
      as="span"
      position="absolute"
      top="-2px"
      right="-6px"
      minW="16px"
      h="16px"
      px="4px"
      borderRadius="full"
      bg="brand.500"
      color="white"
      fontSize="10px"
      fontWeight="700"
      lineHeight="16px"
      textAlign="center"
    >
      {count > 99 ? '99+' : count}
    </Box>
  );
}
