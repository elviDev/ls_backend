import { Server, Socket } from 'socket.io';
import { UserRepository } from '../../domain/repositories';
import {
  SendMessageUseCase,
  GetChatHistoryUseCase,
  LikeMessageUseCase,
  JoinChatUseCase,
  LeaveChatUseCase,
  ModerateMessageUseCase
} from '../../application/interfaces';
import {
  JoinChatDto,
  SendMessageDto,
  TypingDto,
  LikeMessageDto,
  SendMessageRequestDto
} from '../../application/dto';

export class ChatSocketController {
  constructor(
    private io: Server,
    private userRepo: UserRepository,
    private sendMessage: SendMessageUseCase,
    private getChatHistory: GetChatHistoryUseCase,
    private likeMessage: LikeMessageUseCase,
    private joinChat: JoinChatUseCase,
    private leaveChat: LeaveChatUseCase,
    private moderateMessage: ModerateMessageUseCase
  ) {}

  handleConnection(socket: Socket): void {
    socket.on('join-chat', async (broadcastId: string, user: JoinChatDto['user']) => {
      console.log(`💬 User ${user.username} joining chat for broadcast ${broadcastId}`);
      socket.join(`chat:${broadcastId}`);
      await this.joinChat.execute(socket.id, user);
      
      const messages = await this.getChatHistory.execute(broadcastId, 100);
      console.log(`📜 Sending ${messages.length} messages to ${user.username}`);
      socket.emit('chat:history', { messages });
    });

    socket.on('chat:message', async (data: SendMessageDto) => {
      console.log(`💬 New message from socket ${socket.id}: "${data.content}"`);
      const user = await this.userRepo.findBySocketId(socket.id);
      if (!user) {
        console.log(`❌ No user found for socket ${socket.id}`);
        return;
      }

      const message = await this.sendMessage.execute({
        content: data.content,
        userId: user.id,
        username: user.username,
        userAvatar: user.avatar,
        broadcastId: data.broadcastId,
        messageType: data.messageType || 'user',
        replyTo: data.replyTo
      });

      console.log(`📡 Broadcasting message ${message.id} to chat:${data.broadcastId}`);
      this.io.to(`chat:${data.broadcastId}`).emit('chat:message', message);
    });

    socket.on('chat:typing', async (data: TypingDto) => {
      const user = await this.userRepo.findBySocketId(socket.id);
      if (!user) return;

      socket.to(`chat:${data.broadcastId}`).emit('chat:typing', {
        userId: user.id,
        username: user.username,
        isTyping: data.isTyping
      });
    });

    socket.on('chat:like', async (data: LikeMessageDto) => {
      const user = await this.userRepo.findBySocketId(socket.id);
      if (!user) return;

      const message = await this.likeMessage.execute(data.messageId, user.id);
      if (message) {
        this.io.emit('chat:message_liked', {
          messageId: data.messageId,
          likes: message.likes
        });
      }
    });

    socket.on('chat:moderate', async (data: { messageId: string; action: string }) => {
      console.log(`🔨 Moderation request: ${data.action} on message ${data.messageId}`);
      const user = await this.userRepo.findBySocketId(socket.id);
      if (!user || !['host', 'moderator'].includes(user.role)) {
        console.log(`❌ Moderation denied for user ${user?.username || 'unknown'} with role ${user?.role || 'none'}`);
        return;
      }

      const moderatedMessage = await this.moderateMessage.execute(data.messageId, data.action as any);
      
      if (moderatedMessage) {
        console.log(`✅ Message ${data.messageId} moderated: ${data.action}, isPinned: ${moderatedMessage.isPinned}`);
        this.io.emit('chat:message_moderated', {
          messageId: data.messageId,
          action: data.action,
          isPinned: moderatedMessage.isPinned,
          isHighlighted: moderatedMessage.isHighlighted,
          isModerated: moderatedMessage.isModerated
        });
      } else {
        console.log(`❌ Failed to moderate message ${data.messageId}`);
      }
    });

    socket.on('disconnect', async () => {
      await this.leaveChat.execute(socket.id);
    });
  }
}

export class ChatHttpController {
  constructor(
    private getChatHistory: GetChatHistoryUseCase
  ) {}

  async getHistory(broadcastId: string, limit?: number) {
    const messages = await this.getChatHistory.execute(broadcastId, limit);
    return { messages, success: true };
  }
}