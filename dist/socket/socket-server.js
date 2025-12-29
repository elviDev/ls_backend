"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = createSocketServer;
const socket_io_1 = require("socket.io");
const logger_1 = require("../utils/logger");
const environment_1 = require("../config/environment");
const chat_handler_1 = require("./handlers/chat.handler");
const auth_middleware_1 = require("./middleware/auth.middleware");
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
    // Apply authentication middleware to all connections
    io.use(auth_middleware_1.socketAuthMiddleware);
    io.on("connection", (socket) => {
        logger_1.logger.info("Socket connection established", {
            socketId: socket.id,
            remoteAddress: socket.handshake.address,
            userId: socket.data?.userId,
            username: socket.data?.username,
        });
        (0, chat_handler_1.setupChatHandlers)(io, socket);
    });
    return io;
}
//# sourceMappingURL=socket-server.js.map