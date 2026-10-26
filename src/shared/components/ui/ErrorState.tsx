'use client';

import { AppButton } from '@/shared/components/ui/AppButton';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onRetry?: () => void;
  mt?: string | number | Record<string, string | number>;
  compact?: boolean;
  icon?: ReactNode;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  actionLabel,
  actionHref,
  onRetry,
  mt = 8,
  compact = false,
  icon,
}: ErrorStateProps) {
  const label = actionLabel ?? (onRetry ? 'Try again' : undefined);

  return (
    <Flex
      direction="column"
      align="center"
      textAlign="center"
      mt={mt}
      py={compact ? 6 : { base: 10, md: 14 }}
      px={4}
      border="1px solid"
      borderColor="line"
      borderRadius="lg"
      bg="bg"
      role="alert"
    >
      <Flex
        w="52px"
        h="52px"
        borderRadius="full"
        bg="brand.50"
        align="center"
        justify="center"
        color="danger"
        mb={4}
      >
        {icon ?? <AlertCircle size={24} strokeWidth={1.9} />}
      </Flex>

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

      {label && (actionHref || onRetry) ? (
        <Box mt={5}>
          <AppButton
            href={actionHref}
            onClick={onRetry}
            variant="outline"
            size="sm"
          >
            {label}
          </AppButton>
        </Box>
      ) : null}
    </Flex>
  );
}
