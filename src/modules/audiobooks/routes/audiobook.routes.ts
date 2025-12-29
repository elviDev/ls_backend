import { Router } from "express";
import { AudiobookController } from "../controllers/audiobook.controller";
import { AudiobookService } from "../services/audiobook.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
import { authMiddleware, requireAuth, requireStaff } from "../../../middleware/auth";

const router = Router();
const audiobookService = new AudiobookService();
const commentService = new CommentService();
const reviewService = new ReviewService();
const audiobookController = new AudiobookController(audiobookService, commentService, reviewService);

// Public routes
router.get("/", (req, res) => audiobookController.getAudiobooks(req, res));
router.get("/:id", (req, res) => audiobookController.getAudiobookById(req, res));
router.get("/:id/chapters", (req, res) => audiobookController.getChapters(req, res));
router.get("/:id/comments", (req, res) => audiobookController.getComments(req, res));
router.get("/:id/reviews", (req, res) => audiobookController.getReviews(req, res));

// User routes (authenticated)
router.post("/:id/comments", authMiddleware, requireAuth, (req, res) => audiobookController.createComment(req, res));
router.post("/:id/reviews", authMiddleware, requireAuth, (req, res) => audiobookController.createReview(req, res));
router.post("/:id/favorite", authMiddleware, requireAuth, (req, res) => audiobookController.toggleFavorite(req, res));

// Staff routes (protected)
router.post("/", authMiddleware, requireStaff, (req, res) => audiobookController.createAudiobook(req, res));
router.put("/:id", authMiddleware, requireStaff, (req, res) => audiobookController.updateAudiobook(req, res));
router.delete("/:id", authMiddleware, requireStaff, (req, res) => audiobookController.deleteAudiobook(req, res));
router.post("/:id/chapters", authMiddleware, requireStaff, (req, res) => audiobookController.createChapter(req, res));

export default router;