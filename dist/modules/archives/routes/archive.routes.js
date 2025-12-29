"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const archive_controller_1 = require("../controllers/archive.controller");
const archive_service_1 = require("../services/archive.service");
const comment_service_1 = require("../../comments/services/comment.service");
const review_service_1 = require("../../reviews/services/review.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const archiveService = new archive_service_1.ArchiveService();
const commentService = new comment_service_1.CommentService();
const reviewService = new review_service_1.ReviewService();
const archiveController = new archive_controller_1.ArchiveController(archiveService, commentService, reviewService);
// Public routes
router.get("/", (req, res) => archiveController.getArchives(req, res));
router.get("/:id", (req, res) => archiveController.getArchiveById(req, res));
router.get("/:id/comments", (req, res) => archiveController.getComments(req, res));
router.get("/:id/reviews", (req, res) => archiveController.getReviews(req, res));
// User routes
router.post("/:id/comments", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => archiveController.createComment(req, res));
router.post("/:id/reviews", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => archiveController.createReview(req, res));
router.post("/:id/favorite", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => archiveController.toggleFavorite(req, res));
// Staff routes
router.post("/", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => archiveController.createArchive(req, res));
router.put("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => archiveController.updateArchive(req, res));
router.delete("/:id", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => archiveController.deleteArchive(req, res));
exports.default = router;
//# sourceMappingURL=archive.routes.js.map