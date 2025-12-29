import { prisma } from "../../../lib/prisma";
import { CommentDto, CommentUpdateDto } from "../dto/comment.dto";

export class CommentService {
  async getComments(resourceType: string, resourceId: string) {
    const where: any = {};
    
    if (resourceType === 'podcast') where.podcastId = resourceId;
    else if (resourceType === 'audiobook') where.audiobookId = resourceId;
    else if (resourceType === 'broadcast') where.liveBroadcastId = resourceId;
    else if (resourceType === 'episode') where.podcastEpisodeId = resourceId;
    else if (resourceType === 'archive') where.archiveId = resourceId;
    
    const comments = await prisma.comment.findMany({
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

  async createComment(commentData: CommentDto, userId: string) {
    const comment = await prisma.comment.create({
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

  async updateComment(commentId: string, updateData: CommentUpdateDto, userId: string) {
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true }
    });

    if (!existingComment) {
      throw { statusCode: 404, message: "Comment not found" };
    }

    if (existingComment.userId !== userId) {
      throw { statusCode: 403, message: "Not authorized to edit this comment" };
    }

    const comment = await prisma.comment.update({
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

  async deleteComment(commentId: string, userId: string, userType?: string) {
    const existingComment = await prisma.comment.findUnique({
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

    await prisma.comment.delete({
      where: { id: commentId }
    });

    return { success: true };
  }
}