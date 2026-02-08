import { Request, Response } from "express";
import { AudiobookService } from "../services/audiobook.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
export declare class AudiobookController {
    private audiobookService;
    private commentService;
    private reviewService;
    constructor(audiobookService: AudiobookService, commentService: CommentService, reviewService: ReviewService);
    getAudiobooks(req: Request, res: Response): Promise<void>;
    getAudiobookById(req: Request, res: Response): Promise<void>;
    createAudiobook(req: Request, res: Response): Promise<void>;
    updateAudiobook(req: Request, res: Response): Promise<void>;
    deleteAudiobook(req: Request, res: Response): Promise<void>;
    getChapters(req: Request, res: Response): Promise<void>;
    createChapter(req: Request, res: Response): Promise<void>;
    getChapter(req: Request, res: Response): Promise<void>;
    getComments(req: Request, res: Response): Promise<void>;
    createComment(req: Request, res: Response): Promise<void>;
    getReviews(req: Request, res: Response): Promise<void>;
    createReview(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
    updateChapter(req: Request, res: Response): Promise<void>;
    deleteChapter(req: Request, res: Response): Promise<void>;
    toggleFavorite(req: Request, res: Response): Promise<void>;
    saveProgress(req: Request, res: Response): Promise<void>;
    getProgress(req: Request, res: Response): Promise<void>;
    toggleBookmark(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=audiobook.controller.d.ts.map