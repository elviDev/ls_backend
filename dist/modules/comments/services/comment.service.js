"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const prisma_1 = require("../../../lib/prisma");
class CommentService {
    async getComments(resourceType, resourceId) {
        const where = {};
        if (resourceType === 'podcast')
            where.podcastId = resourceId;
        else if (resourceType === 'audiobook')
            where.audiobookId = resourceId;
        else if (resourceType === 'broadcast')
            where.liveBroadcastId = resourceId;
        else if (resourceType === 'episode')
            where.podcastEpisodeId = resourceId;
        else if (resourceType === 'archive')
            where.archiveId = resourceId;
        const comments = await prisma_1.prisma.comment.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true
                    }
                },
                replies: {
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
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { comments };
    }
    async createComment(commentData, userId) {
        const comment = await prisma_1.prisma.comment.create({
            data: {
                ...commentData,
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
        return { comment };
    }
    async updateComment(commentId, updateData, userId) {
        const existingComment = await prisma_1.prisma.comment.findUnique({
            where: { id: commentId },
            select: { userId: true }
        });
        if (!existingComment) {
            throw { statusCode: 404, message: "Comment not found" };
        }
        if (existingComment.userId !== userId) {
            throw { statusCode: 403, message: "Not authorized to edit this comment" };
        }
        const comment = await prisma_1.prisma.comment.update({
            where: { id: commentId },
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
        return { comment };
    }
    async deleteComment(commentId, userId, userType) {
        const existingComment = await prisma_1.prisma.comment.findUnique({
            where: { id: commentId },
            select: { userId: true }
        });
        if (!existingComment) {
            throw { statusCode: 404, message: "Comment not found" };
        }
        // Allow deletion if user owns comment or is staff
        if (existingComment.userId !== userId && userType !== 'staff') {
            throw { statusCode: 403, message: "Not authorized to delete this comment" };
        }
        await prisma_1.prisma.comment.delete({
            where: { id: commentId }
        });
        return { success: true };
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map