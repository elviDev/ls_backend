"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudiobookService = void 0;
const prisma_1 = require("../../../lib/prisma");
class AudiobookService {
    async getAudiobooks(query) {
        const { featured = false, limit = 10, genreId, author, language } = query;
        const where = {
            status: "PUBLISHED"
        };
        if (genreId)
            where.genreId = genreId;
        if (author)
            where.author = { contains: author, mode: "insensitive" };
        if (language)
            where.language = language;
        const audiobooks = await prisma_1.prisma.audiobook.findMany({
            where,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                genre: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                _count: {
                    select: {
                        chapters: true,
                        favorites: true,
                        reviews: true
                    }
                }
            },
            orderBy: featured
                ? [
                    { favorites: { _count: "desc" } },
                    { createdAt: "desc" }
                ]
                : { createdAt: "desc" },
            take: limit
        });
        return { audiobooks, count: audiobooks.length };
    }
    async getAudiobookById(id) {
        const audiobook = await prisma_1.prisma.audiobook.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                genre: true,
                chapters: {
                    orderBy: { trackNumber: 'asc' }
                },
                _count: {
                    select: {
                        chapters: true,
                        favorites: true,
                        reviews: true
                    }
                }
            }
        });
        if (!audiobook) {
            throw { statusCode: 404, message: "Audiobook not found" };
        }
        return audiobook;
    }
    async createAudiobook(audiobookData, createdById) {
        const audiobook = await prisma_1.prisma.audiobook.create({
            data: {
                ...audiobookData,
                createdById,
                status: "DRAFT"
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                genre: true
            }
        });
        return audiobook;
    }
    async updateAudiobook(id, audiobookData, userId) {
        const audiobook = await prisma_1.prisma.audiobook.findUnique({
            where: { id },
            select: { createdById: true }
        });
        if (!audiobook) {
            throw { statusCode: 404, message: "Audiobook not found" };
        }
        if (audiobook.createdById !== userId) {
            throw { statusCode: 403, message: "Not authorized to update this audiobook" };
        }
        const updatedAudiobook = await prisma_1.prisma.audiobook.update({
            where: { id },
            data: audiobookData,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                genre: true
            }
        });
        return updatedAudiobook;
    }
    async deleteAudiobook(id, userId) {
        const audiobook = await prisma_1.prisma.audiobook.findUnique({
            where: { id },
            select: { createdById: true }
        });
        if (!audiobook) {
            throw { statusCode: 404, message: "Audiobook not found" };
        }
        if (audiobook.createdById !== userId) {
            throw { statusCode: 403, message: "Not authorized to delete this audiobook" };
        }
        await prisma_1.prisma.audiobook.delete({
            where: { id }
        });
        return { message: "Audiobook deleted successfully" };
    }
    async getChapters(audiobookId) {
        const chapters = await prisma_1.prisma.chapter.findMany({
            where: { audiobookId },
            orderBy: { trackNumber: 'asc' }
        });
        return { chapters };
    }
    async createChapter(audiobookId, chapterData, userId) {
        const audiobook = await prisma_1.prisma.audiobook.findUnique({
            where: { id: audiobookId },
            select: { createdById: true }
        });
        if (!audiobook) {
            throw { statusCode: 404, message: "Audiobook not found" };
        }
        if (audiobook.createdById !== userId) {
            throw { statusCode: 403, message: "Not authorized to add chapters to this audiobook" };
        }
        const chapter = await prisma_1.prisma.chapter.create({
            data: {
                ...chapterData,
                audiobookId,
                status: "DRAFT"
            }
        });
        return chapter;
    }
    async toggleFavorite(audiobookId, userId) {
        const existing = await prisma_1.prisma.favorite.findFirst({
            where: {
                userId,
                audiobookId
            }
        });
        if (existing) {
            await prisma_1.prisma.favorite.delete({
                where: { id: existing.id }
            });
            return { message: "Removed from favorites", isFavorited: false };
        }
        else {
            await prisma_1.prisma.favorite.create({
                data: {
                    userId,
                    audiobookId
                }
            });
            return { message: "Added to favorites", isFavorited: true };
        }
    }
}
exports.AudiobookService = AudiobookService;
//# sourceMappingURL=audiobook.service.js.map