import { useAuthStore } from '@/features/auth/store/auth-store';
import { sampleAuthUser } from '@/features/auth/types';
import { useMessagingSocket } from '@/features/messages/hooks/useMessagingSocket';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Handler = (payload?: unknown) => void;

function createFakeSocket() {
  const handlers = new Map<string, Set<Handler>>();
  const socket = {
    connected: false,
    on: vi.fn((event: string, handler: Handler) => {
      const set = handlers.get(event) ?? new Set<Handler>();
      set.add(handler);
      handlers.set(event, set);
      return socket;
    }),
    off: vi.fn((event: string, handler: Handler) => {
      handlers.get(event)?.delete(handler);
      return socket;
    }),
    removeAllListeners: vi.fn(() => handlers.clear()),
    disconnect: vi.fn(),
    timeout: vi.fn(() => ({ emit: vi.fn() })),
    /** Simulates an event pushed by the server. */
    receive(event: string, payload?: unknown) {
      for (const handler of handlers.get(event) ?? []) handler(payload);
    },
  };
  return socket;
}

const socketIo = vi.hoisted(() => ({
  io: vi.fn(),
}));

vi.mock('socket.io-client', () => socketIo);

function jwtWithExp(expSeconds: number): string {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode({ exp: expSeconds })}.sig`;
}

const ready = { userId: 'user-1', tenantId: 'tenant-1', kind: 'customer' };

describe('useMessagingSocket', () => {
  let socket: ReturnType<typeof createFakeSocket>;
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    socket = createFakeSocket();
    socketIo.io.mockReturnValue(socket);
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    act(() => {
      useAuthStore.getState().setSession({
        user: sampleAuthUser,
        accessToken: jwtWithExp(Math.floor(Date.now() / 1000) + 3600),
        refreshToken: 'refresh-token',
      });
    });
  });

  afterEach(() => {
    act(() => useAuthStore.getState().logout());
  });

  it('connects with long-polling first so it works behind any proxy', () => {
    const { unmount } = renderHook(() => useMessagingSocket(), { wrapper });

    expect(socketIo.io).toHaveBeenCalledWith(
      expect.stringMatching(/\/messaging$/),
      expect.objectContaining({ transports: ['polling', 'websocket'] }),
    );
    unmount();
    expect(socket.disconnect).toHaveBeenCalled();
  });

  it('refetches messages each time the socket (re)connects', () => {
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    const { result, unmount } = renderHook(() => useMessagingSocket(), {
      wrapper,
    });
    expect(result.current.ready).toBe(false);

    act(() => socket.receive('connection:ready', ready));
    expect(result.current.ready).toBe(true);
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledWith(
      { queryKey: ['messages'] },
      { cancelRefetch: false },
    );

    act(() => socket.receive('disconnect'));
    expect(result.current.ready).toBe(false);

    act(() => socket.receive('connection:ready', ready));
    expect(result.current.ready).toBe(true);
    expect(invalidate).toHaveBeenCalledTimes(2);
    unmount();
  });
});
