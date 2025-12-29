import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
export declare class ReviewController {
    private reviewService;
    constructor(reviewService: ReviewService);
    updateReview(req: Request, res: Response): Promise<void>;
    deleteReview(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=review.controller.d.ts.map