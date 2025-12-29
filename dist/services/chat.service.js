"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = exports.ChatService = void 0;
const logger_1 = require("../utils/logger");
const prisma_1 = require("../lib/prisma");
class ChatService {
    constructor() {
        this.connectedUsers = new Map();
    }
    addUser(socketId, userId, username) {
        this.connectedUsers.set(socketId, { userId, username });
        logger_1.logger.info("👋 User connected", {
            username,
            userId,
            totalOnline: this.connectedUsers.size,
        });
    }
    removeUser(socketId) {
        const user = this.connectedUsers.get(socketId);
        if (user) {
            this.connectedUsers.delete(socketId);
            logger_1.logger.info("👋 User disconnected", {
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
        logger_1.logger.debug("Broadcasting online count", { count });
        io.emit("online-users", count);
    }
    async sendMessage(io, messageData) {
        const message = await prisma_1.prisma.chatMessage.create({
            data: {
                broadcastId: messageData.broadcastId,
                userId: messageData.userId,
                username: messageData.username,
                userAvatar: messageData.userAvatar,
                content: messageData.content.trim(),
                messageType: messageData.messageType || "user",
                isPinned: false,
                likes: 0,
                likedBy: JSON.stringify([]),
            },
        });
        const messageWithParsedLikes = {
            ...message,
            likedBy: JSON.parse(message.likedBy || "[]"),
        };
        io.emit("chat-message", messageWithParsedLikes);
        logger_1.logger.info("💬 Message sent", {
            username: messageData.username,
            userId: messageData.userId,
            role: messageData.messageType,
            broadcast: messageData.broadcastId,
            content: messageData.content.substring(0, 50) + (messageData.content.length > 50 ? '...' : ''),
            messageId: message.id,
        });
    }
    async toggleLike(io, messageId, userId) {
        const message = await prisma_1.prisma.chatMessage.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw new Error("Message not found");
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
        await prisma_1.prisma.chatMessage.update({
            where: { id: messageId },
            data: {
                likes: newLikes,
                likedBy: JSON.stringify(newLikedBy),
            },
        });
        io.emit("message-liked", {
            messageId,
            likes: newLikes,
            likedBy: newLikedBy,
        });
        logger_1.logger.info(hasLiked ? "💔 Message unliked" : "❤️  Message liked", {
            userId,
            messageId,
            totalLikes: newLikes,
        });
    }
    async togglePin(io, messageId) {
        const message = await prisma_1.prisma.chatMessage.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw new Error("Message not found");
        }
        const updatedMessage = await prisma_1.prisma.chatMessage.update({
            where: { id: messageId },
            data: {
                isPinned: !message.isPinned,
            },
        });
        io.emit("message-pinned", {
            messageId,
            isPinned: updatedMessage.isPinned,
        });
        logger_1.logger.info(updatedMessage.isPinned ? "📌 Message pinned" : "📍 Message unpinned", {
            messageId,
            broadcastId: message.broadcastId,
            content: message.content.substring(0, 30) + (message.content.length > 30 ? '...' : ''),
        });
    }
}
exports.ChatService = ChatService;
exports.chatService = new ChatService();
//# sourceMappingURL=chat.service.js.map