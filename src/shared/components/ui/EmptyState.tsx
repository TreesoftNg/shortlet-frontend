'use client';

import { AppButton } from '@/shared/components/ui/AppButton';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  mt?: string | number | Record<string, string | number>;
  compact?: boolean;
};

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
  mt = 8,
  compact = false,
}: EmptyStateProps) {
  return (
    <Flex
      direction="column"
      align="center"
      textAlign="center"
      mt={mt}
      py={compact ? 6 : { base: 10, md: 14 }}
      px={4}
      border="1px dashed"
      borderColor="line"
      borderRadius="lg"
      bg="bg.soft"
    >
      {icon ? (
        <Flex
          w="52px"
          h="52px"
          borderRadius="full"
          bg="bg"
          border="1px solid"
          borderColor="line"
          align="center"
          justify="center"
          color="ink.3"
          mb={4}
        >
          {icon}
        </Flex>
      ) : null}

      <Heading
        as="h3"
        fontSize={compact ? '16px' : { base: '18px', md: '20px' }}
        fontWeight="700"
        letterSpacing="-0.01em"
      >
        {title}
      </Heading>

      {description ? (
        <Text
          color="ink.2"
          fontSize={compact ? '13px' : '14px'}
          mt="8px"
          maxW="420px"
        >
          {description}
        </Text>
      ) : null}

      {actionLabel && (actionHref || onAction) ? (
        <Box mt={5}>
          <AppButton
            href={actionHref}
            onClick={onAction}
            variant="primary"
            size="sm"
          >
            {actionLabel}
          </AppButton>
        </Box>
      ) : null}
    </Flex>
  );
}
