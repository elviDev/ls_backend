import { Router } from "express";
import multer from "multer";
import { PodcastController } from "../controllers/podcast.controller";
import { PodcastService } from "../services/podcast.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
import { authMiddleware, requireAuth, requireStaff } from "../../../middleware/auth";

const router = Router();
const podcastService = new PodcastService();
const commentService = new CommentService();
const reviewService = new ReviewService();
const podcastController = new PodcastController(podcastService, commentService, reviewService);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Public routes
router.get("/", (req, res) => podcastController.getPodcasts(req, res));
router.get("/:id", (req, res) => podcastController.getPodcastById(req, res));
router.get("/:id/episodes", (req, res) => podcastController.getEpisodes(req, res));
router.get("/episodes/:episodeId", (req, res) => podcastController.getEpisodeById(req, res));
router.get("/:id/comments", (req, res) => podcastController.getComments(req, res));
router.get("/:id/reviews", (req, res) => podcastController.getReviews(req, res));

// User routes (authenticated)
router.post("/:id/comments", authMiddleware, requireAuth, (req, res) => podcastController.createComment(req, res));
router.post("/:id/reviews", authMiddleware, requireAuth, (req, res) => podcastController.createReview(req, res));
router.post("/:id/favorite", authMiddleware, requireAuth, (req, res) => podcastController.toggleFavorite(req, res));

// Staff routes (protected)
router.post("/", authMiddleware, requireStaff, upload.fields([{ name: 'coverImage', maxCount: 1 }]), (req, res) => podcastController.createPodcast(req, res));
router.put("/:id", authMiddleware, requireStaff, (req, res) => podcastController.updatePodcast(req, res));
router.delete("/:id", authMiddleware, requireStaff, (req, res) => podcastController.deletePodcast(req, res));
router.post("/:id/episodes", authMiddleware, requireStaff, (req, res) => podcastController.createEpisode(req, res));
router.put("/episodes/:episodeId", authMiddleware, requireStaff, (req, res) => podcastController.updateEpisode(req, res));
router.delete("/episodes/:episodeId", authMiddleware, requireStaff, (req, res) => podcastController.deleteEpisode(req, res));

export default router;