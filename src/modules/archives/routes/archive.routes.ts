import { Router } from "express";
import { ArchiveController } from "../controllers/archive.controller";
import { ArchiveService } from "../services/archive.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
import { authMiddleware, requireAuth, requireStaff } from "../../../middleware/auth";

const router = Router();
const archiveService = new ArchiveService();
const commentService = new CommentService();
const reviewService = new ReviewService();
const archiveController = new ArchiveController(archiveService, commentService, reviewService);

// Public routes
router.get("/", (req, res) => archiveController.getArchives(req, res));
router.get("/:id", (req, res) => archiveController.getArchiveById(req, res));
router.get("/:id/comments", (req, res) => archiveController.getComments(req, res));
router.get("/:id/reviews", (req, res) => archiveController.getReviews(req, res));

// User routes
router.post("/:id/comments", authMiddleware, requireAuth, (req, res) => archiveController.createComment(req, res));
router.post("/:id/reviews", authMiddleware, requireAuth, (req, res) => archiveController.createReview(req, res));
router.post("/:id/favorite", authMiddleware, requireAuth, (req, res) => archiveController.toggleFavorite(req, res));

// Staff routes
router.post("/", authMiddleware, requireStaff, (req, res) => archiveController.createArchive(req, res));
router.put("/:id", authMiddleware, requireStaff, (req, res) => archiveController.updateArchive(req, res));
router.delete("/:id", authMiddleware, requireStaff, (req, res) => archiveController.deleteArchive(req, res));

export default router;