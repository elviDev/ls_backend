import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { ChatService } from "../services/chat.service";
import { authMiddleware, requireAuth, requireModerator } from "../../../middleware/auth";

const router = Router();
const chatService = new ChatService();
const chatController = new ChatController(chatService);

// Public routes
router.get("/:broadcastId", (req, res) => chatController.getMessages(req, res));

// User routes
router.post("/:broadcastId", authMiddleware, requireAuth, (req, res) => chatController.createMessage(req, res));
router.put("/:broadcastId/:messageId", authMiddleware, requireAuth, (req, res) => chatController.updateMessage(req, res));
router.delete("/:broadcastId/:messageId", authMiddleware, requireAuth, (req, res) => chatController.deleteMessage(req, res));
router.post("/:broadcastId/:messageId/like", authMiddleware, requireAuth, (req, res) => chatController.toggleLike(req, res));

// Moderator routes
router.post("/:broadcastId/:messageId/pin", authMiddleware, requireModerator, (req, res) => chatController.togglePin(req, res));

export default router;

// Export chat service for socket.io usage
export { chatService };