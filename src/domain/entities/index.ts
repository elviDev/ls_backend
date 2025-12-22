export interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  userAvatar?: string;
  broadcastId: string;
  messageType: 'user' | 'system' | 'host' | 'moderator';
  timestamp: Date;
  likes: number;
  isPinned: boolean;
  isHighlighted: boolean;
  isModerated: boolean;
  replyTo?: string;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  role: 'host' | 'moderator' | 'user';
}