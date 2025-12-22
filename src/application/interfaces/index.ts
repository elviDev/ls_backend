import { Message, User } from '../entities';

interface SendMessageData {
  content: string;
  userId: string;
  username: string;
  userAvatar?: string;
  broadcastId: string;
  messageType?: string;
  replyTo?: string;
}

export interface SendMessageUseCase {
  execute(data: SendMessageData): Promise<Message>;
}

export interface GetChatHistoryUseCase {
  execute(broadcastId: string, limit?: number): Promise<Message[]>;
}

export interface LikeMessageUseCase {
  execute(messageId: string, userId: string): Promise<Message | null>;
}

export interface JoinChatUseCase {
  execute(socketId: string, user: User): Promise<void>;
}

export interface LeaveChatUseCase {
  execute(socketId: string): Promise<void>;
}

export interface ModerateMessageUseCase {
  execute(messageId: string, action: 'delete' | 'pin' | 'highlight' | 'unpin'): Promise<Message | null>;
}