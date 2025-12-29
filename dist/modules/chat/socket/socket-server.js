"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = createSocketServer;
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("../../../utils/logger"));
const environment_1 = require("../../../config/environment");
const chat_handlers_1 = require("./chat.handlers");
const auth_middleware_1 = require("./auth.middleware");
const chat_service_1 = require("../services/chat.service");
function createSocketServer(httpServer) {
    const socketOptions = {
        cors: {
            origin: [environment_1.config.frontendUrl, "http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true,
        },
        allowEIO3: true,
        transports: ["polling", "websocket"],
    };
    const io = new socket_io_1.Server(httpServer, socketOptions);
    const chatService = new chat_service_1.ChatService();
    // Apply authentication middleware
    io.use(auth_middleware_1.socketAuthMiddleware);
    io.on("connection", (socket) => {
        logger_1.default.info(`🔌 Socket connected [${socket.id}] User: ${socket.data?.username || 'Anonymous'}`);
        (0, chat_handlers_1.setupChatHandlers)(io, socket, chatService);
        socket.on("disconnect", (reason) => {
            logger_1.default.info(`🔌 Socket disconnected [${socket.id}] Reason: ${reason}`);
        });
    });
    logger_1.default.info(`🚀 Socket.IO server initialized on ${environment_1.config.frontendUrl}`);
    return io;
}
//# sourceMappingURL=socket-server.js.map