"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const logger_1 = require("../../../utils/logger");
class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async updateReview(req, res) {
        try {
            const { reviewId } = req.params;
            const updateData = req.body;
            const userId = req.user.id;
            const result = await this.reviewService.updateReview(reviewId, updateData, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'reviews', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteReview(req, res) {
        try {
            const { reviewId } = req.params;
            const userId = req.user.id;
            const userType = req.user.userType;
            const result = await this.reviewService.deleteReview(reviewId, userId, userType);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'reviews', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map