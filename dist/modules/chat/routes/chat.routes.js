"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const chat_service_1 = require("../services/chat.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const chatService = new chat_service_1.ChatService();
exports.chatService = chatService;
const chatController = new chat_controller_1.ChatController(chatService);
// Public routes
router.get("/:broadcastId", (req, res) => chatController.getMessages(req, res));
// User routes
router.post("/:broadcastId", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => chatController.createMessage(req, res));
router.put("/:broadcastId/:messageId", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => chatController.updateMessage(req, res));
router.delete("/:broadcastId/:messageId", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => chatController.deleteMessage(req, res));
router.post("/:broadcastId/:messageId/like", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => chatController.toggleLike(req, res));
// Moderator routes
router.post("/:broadcastId/:messageId/pin", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => chatController.togglePin(req, res));
exports.default = router;
//# sourceMappingURL=chat.routes.js.map