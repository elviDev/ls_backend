import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
import { CommentUpdateDto } from "../dto/comment.dto";
import { logError } from "../../../utils/logger";

export class CommentController {
  constructor(private commentService: CommentService) {}

  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const updateData: CommentUpdateDto = req.body;
      const userId = req.user!.id;

      const result = await this.commentService.updateComment(
        commentId,
        updateData,
        userId
      );
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "comments",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = req.user!.id;
      const userRole = req.user!.userType;

      const result = await this.commentService.deleteComment(
        commentId,
        userId,
        userRole
      );
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "comments",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
