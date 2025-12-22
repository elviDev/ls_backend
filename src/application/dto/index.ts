export interface JoinChatDto {
  broadcastId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
    role: 'host' | 'moderator' | 'user';
  };
}

export interface SendMessageDto {
  content: string;
  broadcastId: string;
  messageType?: 'user' | 'system' | 'host' | 'moderator';
  replyTo?: string;
}

export interface TypingDto {
  broadcastId: string;
  isTyping: boolean;
}

export interface LikeMessageDto {
  messageId: string;
}

export interface SendMessageRequestDto {
  content: string;
  userId: string;
  username: string;
  userAvatar?: string;
  broadcastId: string;
  messageType?: string;
  replyTo?: string;
}