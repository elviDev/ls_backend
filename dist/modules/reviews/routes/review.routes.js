"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const review_service_1 = require("../services/review.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const reviewService = new review_service_1.ReviewService();
const reviewController = new review_controller_1.ReviewController(reviewService);
router.put("/:reviewId", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => reviewController.updateReview(req, res));
router.delete("/:reviewId", auth_1.authMiddleware, auth_1.requireAuth, (req, res) => reviewController.deleteReview(req, res));
exports.default = router;
//# sourceMappingURL=review.routes.js.map