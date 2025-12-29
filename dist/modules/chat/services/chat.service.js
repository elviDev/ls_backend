"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const prisma_1 = require("../../../lib/prisma");
const logger_1 = __importDefault(require("../../../utils/logger"));
class ChatService {
    constructor() {
        this.connectedUsers = new Map();
    }
    async getMessages(broadcastId, limit = 100) {
        const messages = await prisma_1.prisma.chatMessage.findMany({
            where: { broadcastId },
            orderBy: { timestamp: "asc" },
            take: limit,
        });
        return { messages };
    }
    async createMessage(messageData, userId, username, userAvatar) {
        const message = await prisma_1.prisma.chatMessage.create({
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
    async updateMessage(messageId, content, userId) {
        const message = await prisma_1.prisma.chatMessage.findUnique({
            where: { id: messageId },
            select: { userId: true }
        });
        if (!message) {
            throw { statusCode: 404, message: "Message not found" };
        }
        if (message.userId !== userId) {
            throw { statusCode: 403, message: "Not authorized" };
        }
        const updatedMessage = await prisma_1.prisma.chatMessage.update({
            where: { id: messageId },
            data: { content }
        });
        return { message: updatedMessage };
    }
    async deleteMessage(messageId, userId, userType) {
        const message = await prisma_1.prisma.chatMessage.findUnique({
            where: { id: messageId },
            select: { userId: true }
        });
        if (!message) {
            throw { statusCode: 404, message: "Message not found" };
        }
        if (message.userId !== userId && userType !== 'staff') {
            throw { statusCode: 403, message: "Not authorized" };
        }
        await prisma_1.prisma.chatMessage.delete({
            where: { id: messageId }
        });
        return { success: true };
    }
    async toggleLike(messageId, userId) {
        const message = await prisma_1.prisma.chatMessage.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw { statusCode: 404, message: "Message not found" };
        }
        const likedBy = JSON.parse(message.likedBy || "[]");
        const hasLiked = likedBy.includes(userId);
        let newLikedBy;
        let newLikes;
        if (hasLiked) {
            newLikedBy = likedBy.filter((id) => id !== userId);
            newLikes = message.likes - 1;
        }
        else {
            newLikedBy = [...likedBy, userId];
            newLikes = message.likes + 1;
        }
        const updatedMessage = await prisma_1.prisma.chatMessage.update({
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
        };
    }
    async togglePin(messageId) {
        const message = await prisma_1.prisma.chatMessage.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw { statusCode: 404, message: "Message not found" };
        }
        const updatedMessage = await prisma_1.prisma.chatMessage.update({
            where: { id: messageId },
            data: {
                isPinned: !message.isPinned,
            },
        });
        return {
            message: updatedMessage,
            isPinned: updatedMessage.isPinned,
        };
    }
    // Socket.IO methods
    addUser(socketId, userId, username) {
        this.connectedUsers.set(socketId, { userId, username });
        logger_1.default.info("User connected to chat", {
            username,
            userId,
            totalOnline: this.connectedUsers.size,
        });
    }
    removeUser(socketId) {
        const user = this.connectedUsers.get(socketId);
        if (user) {
            this.connectedUsers.delete(socketId);
            logger_1.default.info("User disconnected from chat", {
                username: user.username,
                userId: user.userId,
                totalOnline: this.connectedUsers.size,
            });
        }
    }
    getOnlineCount() {
        return this.connectedUsers.size;
    }
    broadcastOnlineCount(io) {
        const count = this.getOnlineCount();
        io.emit("online-users", count);
    }
    async sendMessageViaSocket(io, messageData, userId, username, userAvatar) {
        const result = await this.createMessage(messageData, userId, username, userAvatar);
        const messageWithParsedLikes = {
            ...result.message,
            likedBy: JSON.parse(result.message.likedBy || "[]"),
        };
        io.emit("chat-message", messageWithParsedLikes);
        logger_1.default.info("Message sent via socket", { messageId: result.message.id, userId, username });
    }
    async toggleLikeViaSocket(io, messageId, userId) {
        const result = await this.toggleLike(messageId, userId);
        io.emit("message-liked", {
            messageId,
            likes: result.likes,
            likedBy: result.likedBy,
        });
    }
    async togglePinViaSocket(io, messageId) {
        const result = await this.togglePin(messageId);
        io.emit("message-pinned", {
            messageId,
            isPinned: result.isPinned,
        });
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map