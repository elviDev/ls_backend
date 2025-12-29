import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";
export declare class CommentController {
    private commentService;
    constructor(commentService: CommentService);
    updateComment(req: Request, res: Response): Promise<void>;
    deleteComment(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=comment.controller.d.ts.map