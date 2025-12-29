import { Request, Response } from "express";
import { ArchiveService } from "../services/archive.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
export declare class ArchiveController {
    private archiveService;
    private commentService;
    private reviewService;
    constructor(archiveService: ArchiveService, commentService: CommentService, reviewService: ReviewService);
    getArchives(req: Request, res: Response): Promise<void>;
    getArchiveById(req: Request, res: Response): Promise<void>;
    createArchive(req: Request, res: Response): Promise<void>;
    updateArchive(req: Request, res: Response): Promise<void>;
    deleteArchive(req: Request, res: Response): Promise<void>;
    getComments(req: Request, res: Response): Promise<void>;
    createComment(req: Request, res: Response): Promise<void>;
    getReviews(req: Request, res: Response): Promise<void>;
    createReview(req: Request, res: Response): Promise<void>;
    toggleFavorite(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=archive.controller.d.ts.map