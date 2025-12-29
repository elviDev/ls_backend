"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get("/:broadcastId", async (req, res) => {
    const startTime = Date.now();
    try {
        const { broadcastId } = req.params;
        logger_1.logger.debug("Fetching chat messages", { broadcastId });
        const messages = await prisma_1.prisma.chatMessage.findMany({
            where: { broadcastId },
            orderBy: { timestamp: "asc" },
            take: 100,
        });
        const duration = Date.now() - startTime;
        logger_1.logger.info("Chat messages fetched", {
            broadcastId,
            messageCount: messages.length,
            duration,
        });
        res.json({ messages });
    }
    catch (error) {
        const duration = Date.now() - startTime;
        logger_1.logger.error("Error fetching chat messages", { error, duration });
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});
router.post("/:broadcastId", async (req, res) => {
    const startTime = Date.now();
    try {
        const { broadcastId } = req.params;
        const { content, messageType } = req.body;
        const user = req.user;
        logger_1.logger.debug("Creating chat message", {
            broadcastId,
            userId: user?.id,
            messageType,
            contentLength: content?.length,
        });
        if (!content?.trim()) {
            const duration = Date.now() - startTime;
            logger_1.logger.warn("Chat message creation failed - empty content", {
                userId: user?.id,
                broadcastId,
                duration,
            });
            res.status(400).json({ error: "Message content is required" });
            return;
        }
        const message = await prisma_1.prisma.chatMessage.create({
            data: {
                broadcastId,
                userId: user?.id || "anonymous",
                username: user?.name || user?.username || "Anonymous",
                userAvatar: user?.profileImage,
                content: content.trim(),
                messageType: messageType || "user",
                isPinned: false,
                likes: 0,
                likedBy: JSON.stringify([]),
            },
        });
        const duration = Date.now() - startTime;
        logger_1.logger.info("Chat message created", {
            messageId: message.id,
            broadcastId,
            userId: user?.id || "anonymous",
            username: user?.name || "Anonymous",
            messageType: message.messageType,
            contentLength: content.trim().length,
            duration,
        });
        res.json({ message });
    }
    catch (error) {
        const duration = Date.now() - startTime;
        logger_1.logger.error("Error creating chat message", { error, duration });
        res.status(500).json({ error: "Failed to create message" });
    }
});
router.post("/:broadcastId/:messageId/like", async (req, res) => {
    const startTime = Date.now();
    try {
        const { messageId, broadcastId } = req.params;
        const user = req.user;
        logger_1.logger.debug("Toggle like request", {
            messageId,
            broadcastId,
            userId: user?.id,
        });
        const message = await prisma_1.prisma.chatMessage.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            const duration = Date.now() - startTime;
            logger_1.logger.warn("Message like toggle failed - message not found", {
                messageId,
                userId: user?.id,
                duration,
            });
            res.status(404).json({ error: "Message not found" });
            return;
        }
        const likedBy = JSON.parse(message.likedBy || "[]");
        const userId = user?.id || "anonymous";
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
        const duration = Date.now() - startTime;
        logger_1.logger.info("Message like toggled", {
            messageId,
            broadcastId,
            userId,
            action: hasLiked ? "unlike" : "like",
            newLikes,
            duration,
        });
        res.json({
            message: updatedMessage,
            likes: newLikes,
            likedBy: newLikedBy,
        });
    }
    catch (error) {
        const duration = Date.now() - startTime;
        logger_1.logger.error("Error toggling message like", { error, duration });
        res.status(500).json({ error: "Failed to toggle like" });
    }
});
router.post("/:broadcastId/:messageId/pin", auth_1.requireModerator, async (req, res) => {
    const startTime = Date.now();
    try {
        const { messageId, broadcastId } = req.params;
        const user = req.user;
        logger_1.logger.debug("Toggle pin request", {
            messageId,
            broadcastId,
            userId: user.id,
            userRole: user.role,
        });
        const message = await prisma_1.prisma.chatMessage.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            const duration = Date.now() - startTime;
            logger_1.logger.warn("Message pin toggle failed - message not found", {
                messageId,
                userId: user.id,
                duration,
            });
            res.status(404).json({ error: "Message not found" });
            return;
        }
        const updatedMessage = await prisma_1.prisma.chatMessage.update({
            where: { id: messageId },
            data: {
                isPinned: !message.isPinned,
            },
        });
        const duration = Date.now() - startTime;
        logger_1.logger.info("Message pin toggled", {
            messageId,
            broadcastId,
            userId: user.id,
            isPinned: updatedMessage.isPinned,
            duration,
        });
        res.json({
            message: updatedMessage,
            isPinned: updatedMessage.isPinned,
        });
    }
    catch (error) {
        const duration = Date.now() - startTime;
        logger_1.logger.error("Error toggling pin", { error, duration });
        res.status(500).json({ error: "Failed to toggle pin" });
    }
});
exports.default = router;
//# sourceMappingURL=chat.routes.js.map