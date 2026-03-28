export type MessageStatus = 'sent' | 'read' | 'failed';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantHandle: string;
  participantAvatar: string | number;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}
