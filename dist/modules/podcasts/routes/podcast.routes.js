"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const podcast_controller_1 = require("../controllers/podcast.controller");
const podcast_service_1 = require("../services/podcast.service");
const comment_service_1 = require("../../comments/services/comment.service");
const review_service_1 = require("../../reviews/services/review.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const podcastService = new podcast_service_1.PodcastService();
const commentService = new comment_service_1.CommentService();
const reviewService = new review_service_1.ReviewService();
const podcastController = new podcast_controller_1.PodcastController(podcastService, commentService, reviewService);
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
});
// Public routes (with optional authentication for user-specific data)
router.get("/", auth_1.authMiddleware, (req, res) => podcastController.getPodcasts(req, res));
router.get("/:id", auth_1.authMiddleware, (req, res) => podcastController.getPodcastById(req, res));
router.get("/:id/episodes", auth_1.authMiddleware, (req, res) => podcastController.getEpisodes(req, res));
router.get("/:id/episodes/:episodeId", auth_1.authMiddleware, (req, res) => podcastController.getEpisodeById(req, res));
router.get("/episodes/:episodeId", auth_1.authMiddleware, (req, res) => podcastController.getEpisodeById(req, res));
router.get("/:id/comments", (req, res) => podcastController.getComments(req, res));
router.get("/:id/reviews", (req, res) => podcastController.getReviews(req, res));
router.get("/:id/episodes/:episodeId/comments", (req, res) => podcastController.getEpisodeComments(req, res));
// User routes (authenticated)
router.post("/:id/comments", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => podcastController.createComment(req, res));
router.post("/:id/reviews", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => podcastController.createReview(req, res));
router.post("/:id/favorite", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => podcastController.toggleFavorite(req, res));
router.post("/:id/episodes/:episodeId/comments", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => podcastController.createEpisodeComment(req, res));
router.post("/:id/episodes/:episodeId/reviews", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => podcastController.createEpisodeReview(req, res));
// Staff routes (protected)
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, upload.fields([{ name: 'coverImage', maxCount: 1 }]), (req, res) => podcastController.createPodcast(req, res));
router.patch("/:id", auth_1.authMiddleware, auth_1.requireStaff, upload.fields([{ name: 'coverImage', maxCount: 1 }]), (req, res) => podcastController.updatePodcast(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.deletePodcast(req, res));
router.post("/:id/episodes", auth_1.authMiddleware, auth_1.requireStaff, upload.fields([{ name: 'audioFile', maxCount: 1 }, { name: 'transcriptFile', maxCount: 1 }]), (req, res) => podcastController.createEpisode(req, res));
router.patch("/:id/episodes/:episodeId", auth_1.authMiddleware, auth_1.requireStaff, upload.fields([{ name: 'audioFile', maxCount: 1 }, { name: 'transcriptFile', maxCount: 1 }]), (req, res) => podcastController.updateEpisode(req, res));
router.delete("/:id/episodes/:episodeId", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.deleteEpisode(req, res));
router.patch("/episodes/:episodeId", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.updateEpisode(req, res));
router.delete("/episodes/:episodeId", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.deleteEpisode(req, res));
exports.default = router;
//# sourceMappingURL=podcast.routes.js.map