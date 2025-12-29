import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { ReviewUpdateDto } from "../dto/review.dto";
import { logError } from "../../../utils/logger";

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const updateData: ReviewUpdateDto = req.body;
      const userId = req.user!.id;

      const result = await this.reviewService.updateReview(
        reviewId,
        updateData,
        userId
      );
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "reviews",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const userId = req.user!.id;
      const userType = req.user!.userType;

      const result = await this.reviewService.deleteReview(
        reviewId,
        userId,
        userType
      );
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "reviews",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
