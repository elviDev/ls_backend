import { Server } from "socket.io";
import { prisma } from "../../../lib/prisma";
import logger from "../../../utils/logger";
import { ChatMessageDto } from "../dto/chat.dto";

export class ChatService {
  private connectedUsers = new Map<string, { userId: string; username: string }>();

  async normalizeBroadcastId(identifier: string): Promise<string | null> {
    try {
      // Try to find by ID first, then by slug
      let broadcast = await prisma.liveBroadcast.findUnique({
        where: { id: identifier },
        select: { id: true }
      });

      // If not found by ID, try by slug
      if (!broadcast) {
        broadcast = await prisma.liveBroadcast.findUnique({
          where: { slug: identifier },
          select: { id: true }
        });
      }

      return broadcast?.id || null;
    } catch (error) {
      console.error('Error normalizing broadcast ID:', error);
      return null;
    }
  }

  async getMessages(broadcastId: string, limit: number = 100) {
    const messages = await prisma.chatMessage.findMany({
      where: { broadcastId },
      orderBy: { timestamp: "asc" },
      take: limit,
    });

    return { messages };
  }

  async createMessage(messageData: ChatMessageDto, userId: string, username: string, userAvatar?: string) {
    const message = await prisma.chatMessage.create({
      data: {
        broadcastId: messageData.broadcastId,
        userId: userId || "anonymous",
        username: username || "Anonymous",
        userAvatar,
        content: messageData.content.trim(),
        messageType: messageData.messageType || "user",
        replyTo: messageData.replyTo,
        isPinned: false,
        likes: 0,
        likedBy: JSON.stringify([]),
      },
    });

    return { message };
  }

  async updateMessage(messageId: string, content: string, userId: string) {
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      select: { userId: true }
    });

    if (!message) {
      throw { statusCode: 404, message: "Message not found" };
    }

    if (message.userId !== userId) {
      throw { statusCode: 403, message: "Not authorized" };
    }

    const updatedMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: { content }
    });

    return { message: updatedMessage };
  }

  async deleteMessage(messageId: string, userId: string, userType?: string) {
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      select: { userId: true }
    });

    if (!message) {
      throw { statusCode: 404, message: "Message not found" };
    }

    if (message.userId !== userId && userType !== 'staff') {
      throw { statusCode: 403, message: "Not authorized" };
    }

    await prisma.chatMessage.delete({
      where: { id: messageId }
    });

    return { success: true };
  }

  async toggleLike(messageId: string, userId: string) {
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw { statusCode: 404, message: "Message not found" };
    }

    const likedBy = JSON.parse(message.likedBy || "[]");
    const hasLiked = likedBy.includes(userId);

    let newLikedBy: string[];
    let newLikes: number;

    if (hasLiked) {
      newLikedBy = likedBy.filter((id: string) => id !== userId);
      newLikes = message.likes - 1;
    } else {
      newLikedBy = [...likedBy, userId];
      newLikes = message.likes + 1;
    }

    const updatedMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        likes: newLikes,
        likedBy: JSON.stringify(newLikedBy),
      },
    });

    return {
      message: updatedMessage,
      likes: newLikes,
      likedBy: newLikedBy,
      broadcastId: message.broadcastId, // Include for socket broadcasting
    };
  }

  async togglePin(messageId: string) {
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw { statusCode: 404, message: "Message not found" };
    }

    const updatedMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        isPinned: !message.isPinned,
      },
    });

    return {
      message: updatedMessage,
      isPinned: updatedMessage.isPinned,
      broadcastId: message.broadcastId, // Include for socket broadcasting
    };
  }

  // Socket.IO methods
  addUser(socketId: string, userId: string, username: string): void {
    this.connectedUsers.set(socketId, { userId, username });
    logger.info("User connected to chat", {
      username,
      userId,
      totalOnline: this.connectedUsers.size,
    });
  }

  removeUser(socketId: string): void {
    const user = this.connectedUsers.get(socketId);
    if (user) {
      this.connectedUsers.delete(socketId);
      logger.info("User disconnected from chat", {
        username: user.username,
        userId: user.userId,
        totalOnline: this.connectedUsers.size,
      });
    }
  }

  getOnlineCount(): number {
    return this.connectedUsers.size;
  }

  broadcastOnlineCount(io: Server): void {
    const count = this.getOnlineCount();
    io.emit("online-users", count);
  }

  async sendMessageViaSocket(io: Server, messageData: ChatMessageDto, userId: string, username: string, userAvatar?: string): Promise<void> {
    const result = await this.createMessage(messageData, userId, username, userAvatar);
    
    const messageWithParsedLikes = {
      ...result.message,
      likedBy: JSON.parse(result.message.likedBy || "[]"),
    };

    const roomName = `broadcast-${messageData.broadcastId}`;
    console.log(`[Chat] Broadcasting message to room: ${roomName}`);
    console.log(`[Chat] Room members:`, io.sockets.adapter.rooms.get(roomName)?.size || 0);
    
    // Broadcast to specific broadcast room instead of all users
    io.to(roomName).emit("chat-message", messageWithParsedLikes);
    logger.info("Message sent via socket", { messageId: result.message.id, userId, username, roomName });
  }

  async toggleLikeViaSocket(io: Server, messageId: string, userId: string): Promise<void> {
    const result = await this.toggleLike(messageId, userId);

    io.to(`broadcast-${result.broadcastId}`).emit("message-liked", {
      messageId,
      likes: result.likes,
      likedBy: result.likedBy,
    });
  }

  async togglePinViaSocket(io: Server, messageId: string): Promise<void> {
    const result = await this.togglePin(messageId);

    io.to(`broadcast-${result.broadcastId}`).emit("message-pinned", {
      messageId,
      isPinned: result.isPinned,
    });
  }

  // Moderation methods
  async kickUser(broadcastId: string, targetUserId: string, moderatorId: string, reason?: string, targetIp?: string): Promise<void> {
    await prisma.chatModerationAction.create({
      data: {
        broadcastId,
        targetUserId,
        moderatorId,
        actionType: "kick",
        reason,
        isActive: true,
      },
    });

    // Update session for both userId and IP
    if (targetIp) {
      await prisma.chatUserSession.updateMany({
        where: { 
          broadcastId, 
          OR: [
            { userId: targetUserId },
            { ipAddress: targetIp }
          ]
        },
        data: { isOnline: false, leftAt: new Date() },
      });
    } else {
      await prisma.chatUserSession.updateMany({
        where: { broadcastId, userId: targetUserId },
        data: { isOnline: false, leftAt: new Date() },
      });
    }
  }

  async banUser(broadcastId: string, targetUserId: string, moderatorId: string, reason?: string, duration?: number, targetIp?: string): Promise<void> {
    const expiresAt = duration ? new Date(Date.now() + duration * 60000) : undefined;

    await prisma.chatModerationAction.create({
      data: {
        broadcastId,
        targetUserId,
        moderatorId,
        actionType: "ban",
        reason,
        duration,
        expiresAt,
        isActive: true,
      },
    });

    // Update session for both userId and IP
    if (targetIp) {
      await prisma.chatUserSession.updateMany({
        where: { 
          broadcastId, 
          OR: [
            { userId: targetUserId },
            { ipAddress: targetIp }
          ]
        },
        data: { isBanned: true, isOnline: false, leftAt: new Date() },
      });
    } else {
      await prisma.chatUserSession.updateMany({
        where: { broadcastId, userId: targetUserId },
        data: { isBanned: true, isOnline: false, leftAt: new Date() },
      });
    }
  }

  async muteUser(broadcastId: string, targetUserId: string, moderatorId: string, reason?: string, duration?: number, targetIp?: string): Promise<void> {
    const expiresAt = duration ? new Date(Date.now() + duration * 60000) : undefined;

    await prisma.chatModerationAction.create({
      data: {
        broadcastId,
        targetUserId,
        moderatorId,
        actionType: "mute",
        reason,
        duration,
        expiresAt,
        isActive: true,
      },
    });

    // Update session for both userId and IP
    if (targetIp) {
      await prisma.chatUserSession.updateMany({
        where: { 
          broadcastId, 
          OR: [
            { userId: targetUserId },
            { ipAddress: targetIp }
          ]
        },
        data: { isMuted: true },
      });
    } else {
      await prisma.chatUserSession.updateMany({
        where: { broadcastId, userId: targetUserId },
        data: { isMuted: true },
      });
    }
  }

  async isUserBanned(broadcastId: string, userId: string, ipAddress?: string): Promise<boolean> {
    const whereClause: any = {
      broadcastId,
      actionType: "ban",
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };

    // Check both userId and IP address
    if (ipAddress) {
      const session = await prisma.chatUserSession.findFirst({
        where: {
          broadcastId,
          ipAddress,
          isBanned: true,
        },
      });
      if (session) return true;
    }

    const activeBan = await prisma.chatModerationAction.findFirst({
      where: {
        ...whereClause,
        targetUserId: userId,
      },
    });

    return !!activeBan;
  }

  async isUserMuted(broadcastId: string, userId: string, ipAddress?: string): Promise<boolean> {
    // Check both userId and IP address
    if (ipAddress) {
      const session = await prisma.chatUserSession.findFirst({
        where: {
          broadcastId,
          ipAddress,
          isMuted: true,
        },
      });
      if (session) return true;
    }

    const activeMute = await prisma.chatModerationAction.findFirst({
      where: {
        broadcastId,
        targetUserId: userId,
        actionType: "mute",
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    return !!activeMute;
  }
}