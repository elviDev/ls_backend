import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { ReviewService } from "../services/review.service";
import { authMiddleware, requireAuth } from "../../../middleware/auth";

const router = Router();
const reviewService = new ReviewService();
const reviewController = new ReviewController(reviewService);

router.put("/:reviewId", authMiddleware, requireAuth, (req, res) => reviewController.updateReview(req, res));
router.delete("/:reviewId", authMiddleware, requireAuth, (req, res) => reviewController.deleteReview(req, res));

export default router;