"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = require("../../../lib/prisma");
class ReviewService {
    async getReviews(resourceType, resourceId) {
        const where = {};
        if (resourceType === 'podcast')
            where.podcastId = resourceId;
        else if (resourceType === 'audiobook')
            where.audiobookId = resourceId;
        else if (resourceType === 'archive')
            where.archiveId = resourceId;
        const reviews = await prisma_1.prisma.review.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { reviews };
    }
    async createReview(reviewData, userId) {
        // Check if user already reviewed this resource
        const where = { userId };
        if (reviewData.podcastId)
            where.podcastId = reviewData.podcastId;
        if (reviewData.audiobookId)
            where.audiobookId = reviewData.audiobookId;
        if (reviewData.archiveId)
            where.archiveId = reviewData.archiveId;
        const existingReview = await prisma_1.prisma.review.findFirst({ where });
        if (existingReview) {
            throw { statusCode: 400, message: "You have already reviewed this content" };
        }
        if (reviewData.rating < 1 || reviewData.rating > 5) {
            throw { statusCode: 400, message: "Rating must be between 1 and 5" };
        }
        const review = await prisma_1.prisma.review.create({
            data: {
                ...reviewData,
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                }
            }
        });
        return { review };
    }
    async updateReview(reviewId, updateData, userId) {
        const existingReview = await prisma_1.prisma.review.findUnique({
            where: { id: reviewId },
            select: { userId: true }
        });
        if (!existingReview) {
            throw { statusCode: 404, message: "Review not found" };
        }
        if (existingReview.userId !== userId) {
            throw { statusCode: 403, message: "Not authorized to edit this review" };
        }
        if (updateData.rating < 1 || updateData.rating > 5) {
            throw { statusCode: 400, message: "Rating must be between 1 and 5" };
        }
        const review = await prisma_1.prisma.review.update({
            where: { id: reviewId },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                }
            }
        });
        return { review };
    }
    async deleteReview(reviewId, userId, userType) {
        const existingReview = await prisma_1.prisma.review.findUnique({
            where: { id: reviewId },
            select: { userId: true }
        });
        if (!existingReview) {
            throw { statusCode: 404, message: "Review not found" };
        }
        // Allow deletion if user owns review or is staff
        if (existingReview.userId !== userId && userType !== 'staff') {
            throw { statusCode: 403, message: "Not authorized to delete this review" };
        }
        await prisma_1.prisma.review.delete({
            where: { id: reviewId }
        });
        return { success: true };
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map