import { Request, Response } from "express";
import { PodcastService } from "../services/podcast.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
export declare class PodcastController {
    private podcastService;
    private commentService;
    private reviewService;
    constructor(podcastService: PodcastService, commentService: CommentService, reviewService: ReviewService);
    getPodcasts(req: Request, res: Response): Promise<void>;
    getPodcastById(req: Request, res: Response): Promise<void>;
    createPodcast(req: Request, res: Response): Promise<void>;
    updatePodcast(req: Request, res: Response): Promise<void>;
    deletePodcast(req: Request, res: Response): Promise<void>;
    createEpisode(req: Request, res: Response): Promise<void>;
    getEpisodes(req: Request, res: Response): Promise<void>;
    getEpisodeById(req: Request, res: Response): Promise<void>;
    updateEpisode(req: Request, res: Response): Promise<void>;
    deleteEpisode(req: Request, res: Response): Promise<void>;
    getComments(req: Request, res: Response): Promise<void>;
    createComment(req: Request, res: Response): Promise<void>;
    getReviews(req: Request, res: Response): Promise<void>;
    createReview(req: Request, res: Response): Promise<void>;
    toggleFavorite(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=podcast.controller.d.ts.map