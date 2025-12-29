"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const comment_service_1 = require("../services/comment.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const commentService = new comment_service_1.CommentService();
const commentController = new comment_controller_1.CommentController(commentService);
router.put("/:commentId", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => commentController.updateComment(req, res));
router.delete("/:commentId", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => commentController.deleteComment(req, res));
exports.default = router;
//# sourceMappingURL=comment.routes.js.map