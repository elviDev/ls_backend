"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatHandlers = setupChatHandlers;
const logger_1 = __importDefault(require("../../../utils/logger"));
function setupChatHandlers(io, socket, chatService) {
    const socketData = socket.data;
    // Register user
    chatService.addUser(socket.id, socketData.userId || "anonymous", socketData.username || "Anonymous");
    chatService.broadcastOnlineCount(io);
    // Message handlers
    socket.on("send-message", (data) => {
        handleSendMessage(io, socket, data, chatService);
    });
    socket.on("toggle-like", (data) => {
        handleToggleLike(io, socket, data, chatService);
    });
    socket.on("toggle-pin", (data) => {
        handleTogglePin(io, socket, data, chatService);
    });
    socket.on("disconnect", () => {
        handleDisconnect(io, socket, chatService);
    });
}
async function handleSendMessage(io, socket, data, chatService) {
    try {
        const { broadcastId, content, messageType = "user" } = data;
        const socketData = socket.data;
        if (!broadcastId || !content?.trim()) {
            socket.emit("error", { message: "Invalid message data" });
            return;
        }
        await chatService.sendMessageViaSocket(io, {
            content,
            messageType,
            broadcastId,
        }, socketData?.userId || "anonymous", socketData?.username || "Anonymous");
    }
    catch (error) {
        logger_1.default.error("Error in send-message", { socketId: socket.id, error });
        socket.emit("error", { message: "Failed to send message" });
    }
}
async function handleToggleLike(io, socket, data, chatService) {
    try {
        const { messageId } = data;
        const socketData = socket.data;
        if (!messageId) {
            socket.emit("error", { message: "Invalid like data" });
            return;
        }
        await chatService.toggleLikeViaSocket(io, messageId, socketData?.userId || "anonymous");
    }
    catch (error) {
        logger_1.default.error("Error in toggle-like", { socketId: socket.id, error });
        socket.emit("error", { message: "Failed to toggle like" });
    }
}
async function handleTogglePin(io, socket, data, chatService) {
    try {
        const { messageId } = data;
        const socketData = socket.data;
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
    }
    catch (error) {
        logger_1.default.error("Error in toggle-pin", { socketId: socket.id, error });
        socket.emit("error", { message: "Failed to toggle pin" });
    }
}
function handleDisconnect(io, socket, chatService) {
    try {
        chatService.removeUser(socket.id);
        chatService.broadcastOnlineCount(io);
    }
    catch (error) {
        logger_1.default.error("Error in disconnect", { socketId: socket.id, error });
    }
}
//# sourceMappingURL=chat.handlers.js.map