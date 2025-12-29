"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatHandlers = setupChatHandlers;
const logger_1 = require("../../utils/logger");
const chat_service_1 = require("../../services/chat.service");
const validation_1 = require("../middleware/validation");
function setupChatHandlers(io, socket) {
    // User is already authenticated via middleware, just register them
    const socketData = socket.data;
    chat_service_1.chatService.addUser(socket.id, socketData.userId || "anonymous", socketData.username || "Anonymous");
    chat_service_1.chatService.broadcastOnlineCount(io);
    socket.on("send-message", (data) => {
        handleSendMessage(io, socket, data);
    });
    socket.on("toggle-like", (data) => {
        handleToggleLike(io, socket, data);
    });
    socket.on("toggle-pin", (data) => {
        handleTogglePin(io, socket, data);
    });
    socket.on("disconnect", () => {
        handleDisconnect(io, socket);
    });
}
function handleSendMessage(io, socket, data) {
    const handleAsync = async () => {
        try {
            const { broadcastId, content, messageType = "message" } = data;
            const socketData = socket.data;
            logger_1.logger.debug("Send message request", {
                socketId: socket.id,
                broadcastId,
                messageType,
                contentLength: content?.length,
                socketData: socketData || "NO SOCKET DATA - User not connected!",
            });
            if (!broadcastId || !content?.trim()) {
                logger_1.logger.warn("Send message failed - invalid data", {
                    socketId: socket.id,
                    broadcastId,
                    hasContent: !!content,
                });
                (0, validation_1.emitError)(socket, "Invalid message data");
                return;
            }
            await chat_service_1.chatService.sendMessage(io, {
                content,
                messageType,
                userId: socketData?.userId || "anonymous",
                username: socketData?.username || "Anonymous",
                userAvatar: undefined,
                broadcastId,
            });
        }
        catch (error) {
            logger_1.logger.error("Error in send-message", { socketId: socket.id, error });
            (0, validation_1.emitError)(socket, "Failed to send message");
        }
    };
    handleAsync();
}
function handleToggleLike(io, socket, data) {
    const handleAsync = async () => {
        try {
            const { messageId } = data;
            const socketData = socket.data;
            logger_1.logger.debug("Toggle like request", {
                socketId: socket.id,
                messageId,
            });
            if (!messageId) {
                logger_1.logger.warn("Toggle like failed - invalid data", {
                    socketId: socket.id,
                    messageId,
                });
                (0, validation_1.emitError)(socket, "Invalid like data");
                return;
            }
            await chat_service_1.chatService.toggleLike(io, messageId, socketData?.userId || "anonymous");
        }
        catch (error) {
            logger_1.logger.error("Error in toggle-like", { socketId: socket.id, error });
            (0, validation_1.emitError)(socket, "Failed to toggle like");
        }
    };
    handleAsync();
}
function handleTogglePin(io, socket, data) {
    const handleAsync = async () => {
        try {
            const { messageId } = data;
            logger_1.logger.debug("Toggle pin request", {
                socketId: socket.id,
                messageId,
            });
            if (!messageId) {
                logger_1.logger.warn("Toggle pin failed - invalid data", {
                    socketId: socket.id,
                    messageId,
                });
                (0, validation_1.emitError)(socket, "Invalid pin data");
                return;
            }
            if (!(0, validation_1.validateStaffPermission)(socket)) {
                return;
            }
            await chat_service_1.chatService.togglePin(io, messageId);
        }
        catch (error) {
            logger_1.logger.error("Error in toggle-pin", { socketId: socket.id, error });
            (0, validation_1.emitError)(socket, "Failed to toggle pin");
        }
    };
    handleAsync();
}
function handleDisconnect(io, socket) {
    try {
        const socketData = socket.data;
        logger_1.logger.info("Socket disconnected", {
            socketId: socket.id,
            username: socketData?.username,
        });
        chat_service_1.chatService.removeUser(socket.id);
        chat_service_1.chatService.broadcastOnlineCount(io);
    }
    catch (error) {
        logger_1.logger.error("Error in disconnect", { socketId: socket.id, error });
    }
}
//# sourceMappingURL=chat.handler.js.map