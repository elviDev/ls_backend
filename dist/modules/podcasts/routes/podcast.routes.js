"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
// Public routes
router.get("/", (req, res) => podcastController.getPodcasts(req, res));
router.get("/:id", (req, res) => podcastController.getPodcastById(req, res));
router.get("/:id/episodes", (req, res) => podcastController.getEpisodes(req, res));
router.get("/episodes/:episodeId", (req, res) => podcastController.getEpisodeById(req, res));
router.get("/:id/comments", (req, res) => podcastController.getComments(req, res));
router.get("/:id/reviews", (req, res) => podcastController.getReviews(req, res));
// User routes (authenticated)
router.post("/:id/comments", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => podcastController.createComment(req, res));
router.post("/:id/reviews", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => podcastController.createReview(req, res));
router.post("/:id/favorite", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => podcastController.toggleFavorite(req, res));
// Staff routes (protected)
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.createPodcast(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.updatePodcast(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.deletePodcast(req, res));
router.post("/:id/episodes", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.createEpisode(req, res));
router.put("/episodes/:episodeId", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.updateEpisode(req, res));
router.delete("/episodes/:episodeId", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => podcastController.deleteEpisode(req, res));
exports.default = router;
//# sourceMappingURL=podcast.routes.js.map