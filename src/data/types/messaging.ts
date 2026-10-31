export type ConversationStatus = 'open' | 'closed';

export type MessageSenderType = 'customer' | 'staff';

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export type ConversationParty = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type ConversationListItem = {
  id: string;
  status: ConversationStatus;
  customer: ConversationParty;
  propertyId: string | null;
  unitId: string | null;
  bookingId: string | null;
  propertyName: string | null;
  unitName: string | null;
  contextLabel: string | null;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  lastMessageSenderType: MessageSenderType | null;
  unreadCount: number;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationDetail = ConversationListItem & {
  customerUnreadCount: number;
  staffUnreadCount: number;
  assignedStaffUserId: string | null;
};

export type ConversationMessage = {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderType: MessageSenderType;
  senderName: string | null;
  content: string;
  messageType: 'text';
  status: MessageStatus;
  clientMessageId: string | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MessagePage = {
  items: ConversationMessage[];
  nextBefore: string | null;
  hasMore: boolean;
};

export type UnreadCount = {
  unreadConversations: number;
  unreadMessages: number;
};

export type CreateConversationInput = {
  propertyId?: string;
  unitId?: string;
  bookingId?: string;
};

export type SendMessageInput = {
  content: string;
  clientMessageId?: string;
};
