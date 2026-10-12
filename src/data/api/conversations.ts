import { http, httpWithMeta } from '@/data/api/http';
import type {
  ConversationDetail,
  ConversationListItem,
  ConversationMessage,
  CreateConversationInput,
  MessagePage,
  SendMessageInput,
  UnreadCount,
} from '@/data/types/messaging';

function auth(token: string) {
  return { token };
}

/** GET /api/v1/me/conversations */
export async function listConversations(
  accessToken: string,
  params: { page?: number; limit?: number; status?: string } = {},
): Promise<ConversationListItem[]> {
  const qs = new URLSearchParams();
  if (params.page != null) qs.set('page', String(params.page));
  if (params.limit != null) qs.set('limit', String(params.limit));
  if (params.status) qs.set('status', params.status);
  const suffix = qs.toString() ? `?${qs}` : '';
  const { data } = await httpWithMeta<ConversationListItem[]>(
    `/api/v1/me/conversations${suffix}`,
    auth(accessToken),
  );
  return Array.isArray(data) ? data : [];
}

/** GET /api/v1/me/conversations/unread-count */
export function getUnreadCount(accessToken: string): Promise<UnreadCount> {
  return http<UnreadCount>(
    '/api/v1/me/conversations/unread-count',
    auth(accessToken),
  );
}

/** GET /api/v1/me/conversations/:id */
export function getConversation(
  conversationId: string,
  accessToken: string,
): Promise<ConversationDetail> {
  return http<ConversationDetail>(
    `/api/v1/me/conversations/${encodeURIComponent(conversationId)}`,
    auth(accessToken),
  );
}

/** GET /api/v1/me/conversations/:id/messages */
export function listMessages(
  conversationId: string,
  accessToken: string,
  params: { before?: string; limit?: number } = {},
): Promise<MessagePage> {
  const qs = new URLSearchParams();
  if (params.before) qs.set('before', params.before);
  if (params.limit != null) qs.set('limit', String(params.limit));
  const suffix = qs.toString() ? `?${qs}` : '';
  return http<MessagePage>(
    `/api/v1/me/conversations/${encodeURIComponent(conversationId)}/messages${suffix}`,
    auth(accessToken),
  );
}

/** POST /api/v1/me/conversations */
export function createConversation(
  input: CreateConversationInput,
  accessToken: string,
): Promise<ConversationDetail> {
  return http<ConversationDetail>('/api/v1/me/conversations', {
    body: input,
    ...auth(accessToken),
  });
}

/** POST /api/v1/me/conversations/:id/messages */
export function sendConversationMessage(
  conversationId: string,
  input: SendMessageInput,
  accessToken: string,
): Promise<ConversationMessage> {
  return http<ConversationMessage>(
    `/api/v1/me/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      body: input,
      ...auth(accessToken),
    },
  );
}

/** POST /api/v1/me/conversations/:id/read */
export function markConversationRead(
  conversationId: string,
  accessToken: string,
): Promise<ConversationDetail> {
  return http<ConversationDetail>(
    `/api/v1/me/conversations/${encodeURIComponent(conversationId)}/read`,
    {
      method: 'POST',
      body: {},
      ...auth(accessToken),
    },
  );
}

/** POST /api/v1/me/conversations/:id/reopen */
export function reopenConversation(
  conversationId: string,
  accessToken: string,
): Promise<ConversationDetail> {
  return http<ConversationDetail>(
    `/api/v1/me/conversations/${encodeURIComponent(conversationId)}/reopen`,
    {
      method: 'POST',
      body: {},
      ...auth(accessToken),
    },
  );
}
