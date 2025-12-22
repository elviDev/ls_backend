import { MessageRepository, UserRepository } from '../../domain/repositories';
import { Message, User } from '../../domain/entities';
import {
  SendMessageUseCase,
  GetChatHistoryUseCase,
  LikeMessageUseCase,
  JoinChatUseCase,
  LeaveChatUseCase
} from '../interfaces';

interface SendMessageData {
  content: string;
  userId: string;
  username: string;
  userAvatar?: string;
  broadcastId: string;
  messageType?: string;
  replyTo?: string;
}

export class SendMessage implements SendMessageUseCase {
  constructor(private messageRepo: MessageRepository) {}

  async execute(data: SendMessageData): Promise<Message> {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: data.content,
      userId: data.userId,
      username: data.username,
      userAvatar: data.userAvatar,
      broadcastId: data.broadcastId,
      messageType: (data.messageType as Message['messageType']) || 'user',
      timestamp: new Date(),
      likes: 0,
      isPinned: false,
      isHighlighted: false,
      isModerated: false,
      replyTo: data.replyTo
    };

    return await this.messageRepo.save(message);
  }
}

export class GetChatHistory implements GetChatHistoryUseCase {
  constructor(private messageRepo: MessageRepository) {}

  async execute(broadcastId: string, limit = 100): Promise<Message[]> {
    return await this.messageRepo.findByBroadcastId(broadcastId, limit);
  }
}

export class LikeMessage implements LikeMessageUseCase {
  constructor(private messageRepo: MessageRepository) {}

  async execute(messageId: string, userId: string): Promise<Message | null> {
    const message = await this.messageRepo.findById(messageId);
    if (!message) return null;

    const newLikes = message.likes + 1;
    await this.messageRepo.updateLikes(messageId, newLikes);
    
    return { ...message, likes: newLikes };
  }
}

export class JoinChat implements JoinChatUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(socketId: string, user: User): Promise<void> {
    await this.userRepo.save(socketId, user);
  }
}

export class LeaveChat implements LeaveChatUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(socketId: string): Promise<void> {
    await this.userRepo.remove(socketId);
  }
}

export class ModerateMessage implements ModerateMessageUseCase {
  constructor(private messageRepo: MessageRepository) {}

  async execute(messageId: string, action: 'delete' | 'pin' | 'highlight' | 'unpin'): Promise<Message | null> {
    console.log(`🔨 ModerateMessage: ${action} on ${messageId}`);
    const message = await this.messageRepo.findById(messageId);
    if (!message) {
      console.log(`❌ Message ${messageId} not found`);
      return null;
    }

    const updates: Partial<Message> = {};
    switch (action) {
      case 'pin':
        updates.isPinned = true;
        console.log(`📌 Pinning message ${messageId}`);
        break;
      case 'unpin':
        updates.isPinned = false;
        console.log(`📌 Unpinning message ${messageId}`);
        break;
      case 'highlight':
        updates.isHighlighted = true;
        console.log(`✨ Highlighting message ${messageId}`);
        break;
      case 'delete':
        updates.isModerated = true;
        console.log(`🗑️ Deleting message ${messageId}`);
        break;
    }

    Object.assign(message, updates);
    const result = await this.messageRepo.save(message);
    console.log(`✅ Message ${messageId} updated: isPinned=${result.isPinned}`);
    return result;
  }
}