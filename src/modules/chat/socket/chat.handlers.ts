import { Socket, Server } from "socket.io";
import logger from "../../../utils/logger";
import { ChatService } from "../services/chat.service";
import { ChatMessageDto } from "../dto/chat.dto";

interface SocketData {
  userId?: string;
  username?: string;
  userType?: string;
  role?: string;
  ipAddress?: string;
}

interface MessageActionData {
  messageId: string;
}

export function setupChatHandlers(io: Server, socket: Socket, chatService: ChatService): void {
  const socketData = socket.data as SocketData;
  
  // Register user
  chatService.addUser(socket.id, socketData.userId || "anonymous", socketData.username || "Anonymous");
  chatService.broadcastOnlineCount(io);

  // Room management
  socket.on("join-broadcast", (broadcastId: string) => {
    handleJoinBroadcast(socket, broadcastId, chatService);
  });

  socket.on("leave-broadcast", (broadcastId: string) => {
    handleLeaveBroadcast(socket, broadcastId);
  });

  // Message handlers
  socket.on("send-message", (data: ChatMessageDto) => {
    handleSendMessage(io, socket, data, chatService);
  });

  socket.on("toggle-like", (data: MessageActionData) => {
    handleToggleLike(io, socket, data, chatService);
  });

  socket.on("toggle-pin", (data: MessageActionData) => {
    handleTogglePin(io, socket, data, chatService);
  });

  // Moderation handlers
  socket.on("kick-user", (data: { broadcastId: string; targetUserId: string; targetIp?: string; reason?: string }) => {
    handleKickUser(io, socket, data, chatService);
  });

  socket.on("ban-user", (data: { broadcastId: string; targetUserId: string; targetIp?: string; reason?: string; duration?: number }) => {
    handleBanUser(io, socket, data, chatService);
  });

  socket.on("mute-user", (data: { broadcastId: string; targetUserId: string; targetIp?: string; reason?: string; duration?: number }) => {
    handleMuteUser(io, socket, data, chatService);
  });

  socket.on("disconnect", () => {
    handleDisconnect(io, socket, chatService);
  });
}

function handleJoinBroadcast(socket: Socket, broadcastId: string, chatService: ChatService): void {
  try {
    // Normalize broadcast ID - always use database ID for rooms
    chatService.normalizeBroadcastId(broadcastId).then(normalizedId => {
      if (normalizedId) {
        socket.join(`broadcast-${normalizedId}`);
        logger.info(`User joined broadcast room`, { socketId: socket.id, broadcastId, normalizedId });
        
        // Send recent messages to the newly joined user
        chatService.getMessages(normalizedId, 50).then(result => {
          socket.emit("chat-history", result.messages);
        }).catch(error => {
          logger.error("Error loading chat history", { error });
        });
      } else {
        socket.emit("error", { message: "Broadcast not found" });
      }
    }).catch(error => {
      logger.error("Error normalizing broadcast ID", { error });
      socket.emit("error", { message: "Failed to join broadcast" });
    });
  } catch (error) {
    logger.error("Error joining broadcast", { socketId: socket.id, broadcastId, error });
  }
}

function handleLeaveBroadcast(socket: Socket, broadcastId: string): void {
  try {
    socket.leave(`broadcast-${broadcastId}`);
    logger.info(`User left broadcast room`, { socketId: socket.id, broadcastId });
  } catch (error) {
    logger.error("Error leaving broadcast", { socketId: socket.id, broadcastId, error });
  }
}

async function handleSendMessage(io: Server, socket: Socket, data: ChatMessageDto, chatService: ChatService): Promise<void> {
  try {
    const { broadcastId, content, messageType = "user" } = data;
    const socketData = socket.data as SocketData;

    if (!broadcastId || !content?.trim()) {
      socket.emit("error", { message: "Invalid message data" });
      return;
    }

    // Normalize broadcast ID to ensure consistent room targeting
    const normalizedBroadcastId = await chatService.normalizeBroadcastId(broadcastId);
    if (!normalizedBroadcastId) {
      socket.emit("error", { message: "Broadcast not found" });
      return;
    }

    // Check if user is banned (check both userId and IP)
    const isBanned = await chatService.isUserBanned(
      normalizedBroadcastId, 
      socketData?.userId || "anonymous",
      socketData?.ipAddress
    );
    if (isBanned) {
      socket.emit("error", { message: "You are banned from this chat" });
      return;
    }

    // Check if user is muted (check both userId and IP)
    const isMuted = await chatService.isUserMuted(
      normalizedBroadcastId, 
      socketData?.userId || "anonymous",
      socketData?.ipAddress
    );
    if (isMuted) {
      socket.emit("error", { message: "You are muted in this chat" });
      return;
    }

    await chatService.sendMessageViaSocket(io, {
      ...data,
      broadcastId: normalizedBroadcastId
    }, socketData?.userId || "anonymous", socketData?.username || "Anonymous");

  } catch (error) {
    logger.error("Error in send-message", { socketId: socket.id, error });
    socket.emit("error", { message: "Failed to send message" });
  }
}

async function handleToggleLike(io: Server, socket: Socket, data: MessageActionData, chatService: ChatService): Promise<void> {
  try {
    const { messageId } = data;
    const socketData = socket.data as SocketData;

    if (!messageId) {
      socket.emit("error", { message: "Invalid like data" });
      return;
    }

    await chatService.toggleLikeViaSocket(io, messageId, socketData?.userId || "anonymous");

  } catch (error) {
    logger.error("Error in toggle-like", { socketId: socket.id, error });
    socket.emit("error", { message: "Failed to toggle like" });
  }
}

async function handleTogglePin(io: Server, socket: Socket, data: MessageActionData, chatService: ChatService): Promise<void> {
  try {
    const { messageId } = data;
    const socketData = socket.data as SocketData;

    if (!messageId) {
      socket.emit("error", { message: "Invalid pin data" });
      return;
    }

    // Check if user is staff
    if (socketData?.userType !== 'staff') {
      socket.emit("error", { message: "Insufficient permissions" });
      return;
    }

    await chatService.togglePinViaSocket(io, messageId);

  } catch (error) {
    logger.error("Error in toggle-pin", { socketId: socket.id, error });
    socket.emit("error", { message: "Failed to toggle pin" });
  }
}

function handleDisconnect(io: Server, socket: Socket, chatService: ChatService): void {
  try {
    chatService.removeUser(socket.id);
    chatService.broadcastOnlineCount(io);
  } catch (error) {
    logger.error("Error in disconnect", { socketId: socket.id, error });
  }
}

async function handleKickUser(io: Server, socket: Socket, data: { broadcastId: string; targetUserId: string; targetIp?: string; reason?: string }, chatService: ChatService): Promise<void> {
  try {
    const socketData = socket.data as SocketData;

    if (socketData?.userType !== 'staff') {
      socket.emit("error", { message: "Insufficient permissions" });
      return;
    }

    await chatService.kickUser(data.broadcastId, data.targetUserId, socketData.userId!, data.reason, data.targetIp);

    // Notify and disconnect the kicked user
    io.to(`broadcast-${data.broadcastId}`).emit("user-kicked", {
      userId: data.targetUserId,
      reason: data.reason,
    });

    // Find and disconnect sockets with matching userId or IP
    const sockets = await io.in(`broadcast-${data.broadcastId}`).fetchSockets();
    for (const s of sockets) {
      const sData = s.data as SocketData;
      if (sData.userId === data.targetUserId || (data.targetIp && sData.ipAddress === data.targetIp)) {
        s.disconnect(true);
      }
    }

    logger.info("User kicked", { targetUserId: data.targetUserId, targetIp: data.targetIp, moderatorId: socketData.userId });
  } catch (error) {
    logger.error("Error kicking user", { error });
    socket.emit("error", { message: "Failed to kick user" });
  }
}

async function handleBanUser(io: Server, socket: Socket, data: { broadcastId: string; targetUserId: string; targetIp?: string; reason?: string; duration?: number }, chatService: ChatService): Promise<void> {
  try {
    const socketData = socket.data as SocketData;

    if (socketData?.userType !== 'staff') {
      socket.emit("error", { message: "Insufficient permissions" });
      return;
    }

    await chatService.banUser(data.broadcastId, data.targetUserId, socketData.userId!, data.reason, data.duration, data.targetIp);

    // Notify and disconnect the banned user
    io.to(`broadcast-${data.broadcastId}`).emit("user-banned", {
      userId: data.targetUserId,
      reason: data.reason,
      duration: data.duration,
    });

    // Find and disconnect sockets with matching userId or IP
    const sockets = await io.in(`broadcast-${data.broadcastId}`).fetchSockets();
    for (const s of sockets) {
      const sData = s.data as SocketData;
      if (sData.userId === data.targetUserId || (data.targetIp && sData.ipAddress === data.targetIp)) {
        s.disconnect(true);
      }
    }

    logger.info("User banned", { targetUserId: data.targetUserId, targetIp: data.targetIp, moderatorId: socketData.userId, duration: data.duration });
  } catch (error) {
    logger.error("Error banning user", { error });
    socket.emit("error", { message: "Failed to ban user" });
  }
}

async function handleMuteUser(io: Server, socket: Socket, data: { broadcastId: string; targetUserId: string; targetIp?: string; reason?: string; duration?: number }, chatService: ChatService): Promise<void> {
  try {
    const socketData = socket.data as SocketData;

    if (socketData?.userType !== 'staff') {
      socket.emit("error", { message: "Insufficient permissions" });
      return;
    }

    await chatService.muteUser(data.broadcastId, data.targetUserId, socketData.userId!, data.reason, data.duration, data.targetIp);

    // Notify about the mute
    io.to(`broadcast-${data.broadcastId}`).emit("user-muted", {
      userId: data.targetUserId,
      reason: data.reason,
      duration: data.duration,
    });

    logger.info("User muted", { targetUserId: data.targetUserId, targetIp: data.targetIp, moderatorId: socketData.userId, duration: data.duration });
  } catch (error) {
    logger.error("Error muting user", { error });
    socket.emit("error", { message: "Failed to mute user" });
  }
}