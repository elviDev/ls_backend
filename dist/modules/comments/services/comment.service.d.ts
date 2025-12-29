import { CommentDto, CommentUpdateDto } from "../dto/comment.dto";
export declare class CommentService {
    getComments(resourceType: string, resourceId: string): Promise<{
        comments: ({
            user: {
                name: string;
                id: string;
                email: string;
                profileImage: string;
            };
            replies: ({
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
                content: string;
                podcastEpisodeId: string | null;
                liveBroadcastId: string | null;
                parentId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            audiobookId: string | null;
            podcastId: string | null;
            archiveId: string | null;
            content: string;
            podcastEpisodeId: string | null;
            liveBroadcastId: string | null;
            parentId: string | null;
        })[];
    }>;
    createComment(commentData: CommentDto, userId: string): Promise<{
        comment: {
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
            content: string;
            podcastEpisodeId: string | null;
            liveBroadcastId: string | null;
            parentId: string | null;
        };
    }>;
    updateComment(commentId: string, updateData: CommentUpdateDto, userId: string): Promise<{
        comment: {
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
            content: string;
            podcastEpisodeId: string | null;
            liveBroadcastId: string | null;
            parentId: string | null;
        };
    }>;
    deleteComment(commentId: string, userId: string, userType?: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=comment.service.d.ts.map