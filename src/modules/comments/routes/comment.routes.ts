import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { CommentService } from "../services/comment.service";
import { authMiddleware, requireAuth } from "../../../middleware/auth";

const router = Router();
const commentService = new CommentService();
const commentController = new CommentController(commentService);

router.put("/:commentId", authMiddleware, requireAuth, (req, res) => commentController.updateComment(req, res));
router.delete("/:commentId", authMiddleware, requireAuth, (req, res) => commentController.deleteComment(req, res));

export default router;