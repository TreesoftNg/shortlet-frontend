'use client';

import { createConversation } from '@/data/api/conversations';
import { ApiError } from '@/data/api/http';
import { queryKeys } from '@/data/query-keys';
import {
  useAuthStore,
  useIsAuthenticated,
} from '@/features/auth/store/auth-store';
import { AppButton } from '@/shared/components';
import { Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type MessageUsButtonProps = {
  propertyId?: string;
  unitId?: string;
  bookingId?: string;
  size?: 'sm' | 'md';
  variant?: 'outline' | 'soft' | 'primary';
};

export function MessageUsButton({
  propertyId,
  unitId,
  bookingId,
  size = 'sm',
  variant = 'outline',
}: MessageUsButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    if (!isAuthenticated) {
      const next = encodeURIComponent(
        typeof window !== 'undefined' ? window.location.pathname : '/messages',
      );
      router.push(`/auth?next=${next}`);
      return;
    }

    setLoading(true);
    try {
      const token = useAuthStore.getState().getValidAccessToken();
      if (!token) {
        router.push('/auth');
        return;
      }
      const created = await createConversation(
        { propertyId, unitId, bookingId },
        token,
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.conversations(),
      });
      router.push(`/messages/${created.id}`);
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'status' in err &&
        (err as { status: number }).status === 401
      ) {
        useAuthStore.getState().logout();
        router.push('/auth');
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not start a chat.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppButton
        size={size}
        variant={variant}
        onClick={() => void handleClick()}
        disabled={loading}
      >
        {loading ? 'Opening…' : 'Message us'}
      </AppButton>
      {error ? (
        <Text color="red.500" fontSize="12px" mt={2}>
          {error}
        </Text>
      ) : null}
    </>
  );
}
