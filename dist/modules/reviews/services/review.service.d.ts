import { ReviewDto, ReviewUpdateDto } from "../dto/review.dto";
export declare class ReviewService {
    getReviews(resourceType: string, resourceId: string): Promise<{
        reviews: ({
            user: {
                name: string;
                id: string;
                email: string;
                profileImage: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            audiobookId: string | null;
            podcastId: string | null;
            archiveId: string | null;
            comment: string | null;
            rating: number;
        })[];
    }>;
    createReview(reviewData: ReviewDto, userId: string): Promise<{
        review: {
            user: {
                name: string;
                id: string;
                email: string;
                profileImage: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            audiobookId: string | null;
            podcastId: string | null;
            archiveId: string | null;
            comment: string | null;
            rating: number;
        };
    }>;
    updateReview(reviewId: string, updateData: ReviewUpdateDto, userId: string): Promise<{
        review: {
            user: {
                name: string;
                id: string;
                email: string;
                profileImage: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            audiobookId: string | null;
            podcastId: string | null;
            archiveId: string | null;
            comment: string | null;
            rating: number;
        };
    }>;
    deleteReview(reviewId: string, userId: string, userType?: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=review.service.d.ts.map