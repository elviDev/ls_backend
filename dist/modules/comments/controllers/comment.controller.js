"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const logger_1 = require("../../../utils/logger");
class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    async updateComment(req, res) {
        try {
            const { commentId } = req.params;
            const updateData = req.body;
            const userId = req.user.id;
            const result = await this.commentService.updateComment(commentId, updateData, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "comments",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteComment(req, res) {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.userType;
            const result = await this.commentService.deleteComment(commentId, userId, userRole);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "comments",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map