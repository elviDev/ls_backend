import { Server as HttpServer } from "http";
import { Server, ServerOptions } from "socket.io";
import logger from "../../../utils/logger";
import { config } from "../../../config/environment";
import { setupChatHandlers } from "./chat.handlers";
import { socketAuthMiddleware } from "./auth.middleware";
import { ChatService } from "../services/chat.service";

export function createSocketServer(httpServer: HttpServer): Server {
  const socketOptions: Partial<ServerOptions> = {
    cors: {
      origin: [
        config.frontendUrl, 
        "http://localhost:3000",
        "https://lsfrontend-production.up.railway.app",
        "https://cbs-radio.com",
        "https://www.cbs-radio.com"
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    allowEIO3: true,
    transports: ["polling", "websocket"],
  };

  const io = new Server(httpServer, socketOptions);
  const chatService = new ChatService();

  // Apply authentication middleware
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    logger.info(`🔌 Socket connected [${socket.id}] User: ${socket.data?.username || 'Anonymous'}`);

    setupChatHandlers(io, socket, chatService);
    
    socket.on("disconnect", (reason) => {
      logger.info(`🔌 Socket disconnected [${socket.id}] Reason: ${reason}`);
    });
  });

  logger.info(`🚀 Socket.IO server initialized on ${config.frontendUrl}`);
  return io;
}