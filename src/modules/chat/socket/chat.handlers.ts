import { Socket, Server } from "socket.io";
import logger from "../../../utils/logger";
import { ChatService } from "../services/chat.service";
import { ChatMessageDto } from "../dto/chat.dto";

interface SocketData {
  userId?: string;
  username?: string;
  userType?: string;
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