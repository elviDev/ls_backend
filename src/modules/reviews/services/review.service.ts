import { prisma } from "../../../lib/prisma";
import { ReviewDto, ReviewUpdateDto } from "../dto/review.dto";

export class ReviewService {
  async getReviews(resourceType: string, resourceId: string) {
    const where: any = {};
    
    if (resourceType === 'podcast') where.podcastId = resourceId;
    else if (resourceType === 'audiobook') where.audiobookId = resourceId;
    else if (resourceType === 'archive') where.archiveId = resourceId;
    
    const reviews = await prisma.review.findMany({
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

  async createReview(reviewData: ReviewDto, userId: string) {
    // Check if user already reviewed this resource
    const where: any = { userId };
    if (reviewData.podcastId) where.podcastId = reviewData.podcastId;
    if (reviewData.audiobookId) where.audiobookId = reviewData.audiobookId;
    if (reviewData.archiveId) where.archiveId = reviewData.archiveId;

    const existingReview = await prisma.review.findFirst({ where });

    if (existingReview) {
      throw { statusCode: 400, message: "You have already reviewed this content" };
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw { statusCode: 400, message: "Rating must be between 1 and 5" };
    }

    const review = await prisma.review.create({
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

  async updateReview(reviewId: string, updateData: ReviewUpdateDto, userId: string) {
    const existingReview = await prisma.review.findUnique({
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

    const review = await prisma.review.update({
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

  async deleteReview(reviewId: string, userId: string, userType?: string) {
    const existingReview = await prisma.review.findUnique({
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

    await prisma.review.delete({
      where: { id: reviewId }
    });

    return { success: true };
  }
}