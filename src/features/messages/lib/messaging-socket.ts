'use client';

import { getApiBaseUrl } from '@/data/config';
import type { ConversationMessage } from '@/data/types/messaging';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { io, type Socket } from 'socket.io-client';

export type MessagingSocketEvents = {
  'connection:ready': (payload: {
    userId: string;
    tenantId: string;
    kind: string;
  }) => void;
  'connection:error': (payload: { code: string; message: string }) => void;
  'message:new': (message: ConversationMessage) => void;
  'message:read': (payload: {
    conversationId: string;
    readerUserId: string;
    readerKind: string;
    readAt: string;
    customerUnreadCount: number;
    staffUnreadCount: number;
  }) => void;
  'unread:update': (payload: {
    conversationId: string;
    customerUnreadCount: number;
    staffUnreadCount: number;
    forKind: string;
    unreadConversations: number;
    unreadMessages: number;
  }) => void;
  'typing:start': (payload: {
    conversationId: string;
    userId: string;
    kind: string;
  }) => void;
  'typing:stop': (payload: {
    conversationId: string;
    userId: string;
    kind: string;
  }) => void;
};

type AckOk<T> = { ok: true } & T;
type EmitAck<T> = AckOk<T> | { ok?: false; code?: string; message?: string };

let shared: Socket | null = null;
let sharedToken: string | null = null;

function messagingOrigin(): string {
  return getApiBaseUrl().replace(/\/$/, '');
}

function currentGuestToken(): string | null {
  return useAuthStore.getState().getValidAccessToken();
}

/**
 * Singleton customer messaging socket.
 * Auth is resolved on every connect/reconnect so a stale access token is not reused.
 * (Guest REST refresh is not wired yet — expired sessions still require re-login.)
 */
export function getMessagingSocket(accessToken?: string): Socket | null {
  const token = accessToken ?? currentGuestToken();
  if (!token) {
    disconnectMessagingSocket();
    return null;
  }

  if (shared && sharedToken === token) {
    return shared;
  }

  disconnectMessagingSocket();

  sharedToken = token;
  shared = io(`${messagingOrigin()}/messaging`, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: (cb) => {
      const next = currentGuestToken() ?? sharedToken ?? '';
      sharedToken = next || sharedToken;
      cb({
        token: next || token,
        actor: 'customer',
      });
    },
  });

  return shared;
}

export function disconnectMessagingSocket(): void {
  if (shared) {
    shared.removeAllListeners();
    shared.disconnect();
    shared = null;
    sharedToken = null;
  }
}

export function emitWithAck<T>(
  socket: Socket,
  event: string,
  payload: unknown,
): Promise<T> {
  return new Promise((resolve, reject) => {
    socket
      .timeout(12_000)
      .emit(event, payload, (err: Error | null, response: EmitAck<T>) => {
        if (err) {
          reject(err);
          return;
        }
        if (!response || (response as { ok?: boolean }).ok === false) {
          const failed = response as { code?: string; message?: string };
          reject(
            new Error(failed.message ?? failed.code ?? 'Socket request failed'),
          );
          return;
        }
        resolve(response as T);
      });
  });
}

export function joinConversation(socket: Socket, conversationId: string) {
  return emitWithAck<{ ok: true; conversationId: string }>(
    socket,
    'conversation:join',
    { conversationId },
  );
}

export function leaveConversation(socket: Socket, conversationId: string) {
  return emitWithAck<{ ok: true; conversationId: string }>(
    socket,
    'conversation:leave',
    { conversationId },
  );
}

export function sendMessageViaSocket(
  socket: Socket,
  payload: {
    conversationId: string;
    content: string;
    clientMessageId?: string;
  },
) {
  return emitWithAck<{ ok: true; message: ConversationMessage }>(
    socket,
    'message:send',
    payload,
  );
}

export function markReadViaSocket(socket: Socket, conversationId: string) {
  return emitWithAck<{ ok: true; conversation: unknown }>(
    socket,
    'message:read',
    { conversationId },
  );
}

export function typingStart(socket: Socket, conversationId: string) {
  return emitWithAck<{ ok: true }>(socket, 'typing:start', { conversationId });
}

export function typingStop(socket: Socket, conversationId: string) {
  return emitWithAck<{ ok: true }>(socket, 'typing:stop', { conversationId });
}
