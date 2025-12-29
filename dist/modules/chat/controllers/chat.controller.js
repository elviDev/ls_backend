"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const logger_1 = require("../../../utils/logger");
class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getMessages(req, res) {
        try {
            const { broadcastId } = req.params;
            const limit = parseInt(req.query.limit) || 100;
            const result = await this.chatService.getMessages(broadcastId, limit);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'chat', action: 'Get messages error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createMessage(req, res) {
        try {
            const { broadcastId } = req.params;
            const messageData = { ...req.body, broadcastId };
            const user = req.user;
            const result = await this.chatService.createMessage(messageData, user.id, user.name || user.username || "Anonymous", user.profileImage);
            res.status(201).json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'chat', action: 'Create message error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateMessage(req, res) {
        try {
            const { messageId } = req.params;
            const { content } = req.body;
            const userId = req.user.id;
            const result = await this.chatService.updateMessage(messageId, content, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'chat', action: 'Update message error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteMessage(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user.id;
            const userType = req.user.userType;
            const result = await this.chatService.deleteMessage(messageId, userId, userType);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'chat', action: 'Delete message error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async toggleLike(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user.id;
            const result = await this.chatService.toggleLike(messageId, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'chat', action: 'Toggle like error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async togglePin(req, res) {
        try {
            const { messageId } = req.params;
            const result = await this.chatService.togglePin(messageId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'chat', action: 'Toggle pin error' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map