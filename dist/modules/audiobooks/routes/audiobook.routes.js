"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audiobook_controller_1 = require("../controllers/audiobook.controller");
const audiobook_service_1 = require("../services/audiobook.service");
const comment_service_1 = require("../../comments/services/comment.service");
const review_service_1 = require("../../reviews/services/review.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const audiobookService = new audiobook_service_1.AudiobookService();
const commentService = new comment_service_1.CommentService();
const reviewService = new review_service_1.ReviewService();
const audiobookController = new audiobook_controller_1.AudiobookController(audiobookService, commentService, reviewService);
// Public routes
router.get("/", (req, res) => audiobookController.getAudiobooks(req, res));
router.get("/:id", (req, res) => audiobookController.getAudiobookById(req, res));
router.get("/:id/chapters", (req, res) => audiobookController.getChapters(req, res));
router.get("/:id/comments", (req, res) => audiobookController.getComments(req, res));
router.get("/:id/reviews", (req, res) => audiobookController.getReviews(req, res));
// User routes (authenticated)
router.post("/:id/comments", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => audiobookController.createComment(req, res));
router.post("/:id/reviews", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => audiobookController.createReview(req, res));
router.post("/:id/favorite", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => audiobookController.toggleFavorite(req, res));
// Staff routes (protected)
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => audiobookController.createAudiobook(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => audiobookController.updateAudiobook(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => audiobookController.deleteAudiobook(req, res));
router.post("/:id/chapters", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => audiobookController.createChapter(req, res));
exports.default = router;
//# sourceMappingURL=audiobook.routes.js.map