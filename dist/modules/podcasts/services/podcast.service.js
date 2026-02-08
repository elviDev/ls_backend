"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastService = void 0;
const prisma_1 = require("../../../lib/prisma");
const logger_1 = require("../../../utils/logger");
class PodcastService {
    async getPodcasts(query, userId) {
        const { featured = false, limit = 10, category, genreId, status } = query;
        const where = {};
        // Add status filter if specified
        if (status) {
            where.status = status;
        }
        if (category) {
            where.category = category;
        }
        if (genreId) {
            where.genreId = genreId;
        }
        const podcasts = await prisma_1.prisma.podcast.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        bio: true,
                    },
                },
                genre: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                host: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        role: true,
                    },
                },
                _count: {
                    select: {
                        episodes: true,
                        favorites: true,
                        comments: true,
                        reviews: true,
                        bookmarks: true,
                    },
                },
                favorites: userId
                    ? {
                        where: {
                            OR: [{ userId }, { staffId: userId }],
                        },
                        select: { id: true },
                    }
                    : false,
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: { select: { name: true } },
                    },
                    take: 3,
                    orderBy: { createdAt: "desc" },
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: { select: { name: true } },
                    },
                    take: 3,
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: featured
                ? [{ favorites: { _count: "desc" } }, { createdAt: "desc" }]
                : { createdAt: "desc" },
            take: limit,
        });
        const podcastsWithData = await Promise.all(podcasts.map(async (podcast) => {
            const latestEpisode = await prisma_1.prisma.podcastEpisode.findFirst({
                where: {
                    podcastId: podcast.id,
                    status: "PUBLISHED",
                },
                orderBy: { publishedAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    duration: true,
                    publishedAt: true,
                },
            });
            return {
                id: podcast.id,
                title: podcast.title,
                slug: podcast.slug,
                description: podcast.description,
                category: podcast.category,
                image: podcast.image,
                coverImage: podcast.coverImage,
                status: podcast.status,
                author: podcast.author,
                genre: podcast.genre,
                hostId: podcast.host?.id || podcast.host,
                host: podcast.host,
                _count: podcast._count,
                isFavorited: userId ? podcast.favorites.length > 0 : false,
                recentReviews: podcast.reviews,
                recentComments: podcast.comments,
                latestEpisode,
                createdAt: podcast.createdAt,
                updatedAt: podcast.updatedAt,
            };
        }));
        return {
            podcasts: podcastsWithData,
            count: podcastsWithData.length,
        };
    }
    async getPodcastById(id, userId) {
        const podcast = (await prisma_1.prisma.podcast.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        bio: true,
                    },
                },
                host: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        role: true,
                    },
                },
                genre: true,
                episodes: {
                    where: { status: "PUBLISHED" },
                    orderBy: { publishedAt: "desc" },
                    take: 10,
                    include: {
                        _count: {
                            select: {
                                comments: true,
                                favorites: true,
                            },
                        },
                        favorites: userId
                            ? {
                                where: {
                                    OR: [{ userId }, { staffId: userId }],
                                },
                                select: { id: true },
                            }
                            : false,
                        playbackProgress: userId
                            ? {
                                where: {
                                    OR: [{ userId }, { staffId: userId }],
                                },
                                select: { position: true, updatedAt: true },
                            }
                            : false,
                    },
                },
                _count: {
                    select: {
                        episodes: true,
                        favorites: true,
                        comments: true,
                        reviews: true,
                        bookmarks: true,
                    },
                },
                favorites: userId
                    ? {
                        where: {
                            OR: [{ userId }, { staffId: userId }],
                        },
                        select: { id: true },
                    }
                    : false,
                bookmarks: userId
                    ? {
                        where: { userId },
                        select: { id: true, position: true, createdAt: true },
                    }
                    : false,
                playbackProgress: userId
                    ? {
                        where: {
                            OR: [{ userId }, { staffId: userId }],
                        },
                        select: { position: true, updatedAt: true },
                    }
                    : false,
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: { select: { name: true } },
                    },
                    take: 5,
                    orderBy: { createdAt: "desc" },
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: { select: { name: true } },
                    },
                    take: 5,
                    orderBy: { createdAt: "desc" },
                },
            },
        }));
        if (!podcast) {
            throw { statusCode: 404, message: "Podcast not found" };
        }
        // Process episodes with user-specific data
        const episodesWithUserData = podcast.episodes.map((episode) => ({
            ...episode,
            isFavorited: userId ? episode.favorites.length > 0 : false,
            playbackProgress: userId && episode.playbackProgress.length > 0
                ? episode.playbackProgress[0]
                : null,
            favorites: undefined, // Remove from response
        }));
        // Add user-specific fields
        const result = {
            ...podcast,
            hostId: podcast.host?.id || podcast.host, // Extract ID from relation or use raw field
            host: podcast.host, // Full host data from relation
            episodes: episodesWithUserData,
            isFavorited: userId ? podcast.favorites.length > 0 : false,
            isBookmarked: userId ? (podcast.bookmarks?.length || 0) > 0 : false,
            userBookmarks: userId ? podcast.bookmarks || [] : [],
            playbackProgress: userId && podcast.playbackProgress.length > 0
                ? podcast.playbackProgress[0]
                : null,
            userReview: userId && podcast.reviews.length > 0 ? podcast.reviews[0] : null,
            recentReviews: podcast.reviews, // Always include all reviews
        };
        // Clean up response - only remove raw relation arrays
        delete result.favorites;
        delete result.bookmarks;
        return result;
    }
    async createPodcast(podcastData, authorId) {
        // Convert releaseDate string to ISO-8601 DateTime
        const releaseDateTime = podcastData.releaseDate
            ? new Date(podcastData.releaseDate).toISOString()
            : new Date().toISOString();
        // Extract relation fields and prepare data
        const { genreId, host, coverImage, ...restData } = podcastData;
        const createData = {
            ...restData,
            releaseDate: releaseDateTime,
            author: {
                connect: { id: authorId },
            },
            status: "DRAFT",
        };
        // Set both coverImage and image to the same value
        if (coverImage) {
            createData.coverImage = coverImage;
            createData.image = coverImage;
        }
        // Connect genre if provided
        if (genreId) {
            createData.genre = {
                connect: { id: genreId },
            };
        }
        // Connect host if provided
        if (host) {
            createData.host = {
                connect: { id: host },
            };
        }
        const podcast = await prisma_1.prisma.podcast.create({
            data: createData,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                    },
                },
                host: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        role: true,
                    },
                },
                genre: true,
            },
        });
        (0, logger_1.logDatabase)("create", "podcast", podcast.id);
        return podcast;
    }
    async updatePodcast(id, podcastData, userId) {
        const podcast = await prisma_1.prisma.podcast.findUnique({
            where: { id },
            select: { authorId: true },
        });
        if (!podcast) {
            throw { statusCode: 404, message: "Podcast not found" };
        }
        if (podcast.authorId !== userId) {
            throw {
                statusCode: 403,
                message: "Not authorized to update this podcast",
            };
        }
        // Prepare update data - only include fields that are provided and valid
        const updateData = {};
        // Define valid fields that exist in the Prisma schema
        const validFields = [
            "title",
            "slug",
            "description",
            "category",
            "image",
            "coverImage",
            "audioFile",
            "duration",
            "releaseDate",
            "tags",
            "status",
        ];
        // Only update fields that are provided and valid
        Object.keys(podcastData).forEach((key) => {
            const value = podcastData[key];
            if (value !== undefined && value !== null && validFields.includes(key)) {
                updateData[key] = value;
            }
        });
        // Convert releaseDate string to ISO-8601 DateTime if provided
        if (updateData.releaseDate) {
            updateData.releaseDate = new Date(updateData.releaseDate).toISOString();
        }
        // Convert status to uppercase if provided
        if (updateData.status) {
            updateData.status = updateData.status.toUpperCase();
        }
        // Set both coverImage and image to the same value if coverImage is provided
        if (updateData.coverImage) {
            updateData.image = updateData.coverImage;
        }
        // Handle relation fields that need to be connected
        if (podcastData.genreId) {
            updateData.genre = { connect: { id: podcastData.genreId } };
        }
        if (podcastData.host || podcastData.hostId) {
            const hostId = podcastData.host || podcastData.hostId;
            updateData.host = { connect: { id: hostId } };
        }
        const updatedPodcast = await prisma_1.prisma.podcast.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                    },
                },
                host: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        role: true,
                    },
                },
                genre: true,
            },
        });
        (0, logger_1.logDatabase)("update", "podcast", id);
        // Add hostId field for consistency
        const result = {
            ...updatedPodcast,
            hostId: updatedPodcast.host?.id || updatedPodcast.host,
        };
        return result;
    }
    async deletePodcast(id, userId) {
        const podcast = await prisma_1.prisma.podcast.findUnique({
            where: { id },
            select: { authorId: true },
        });
        if (!podcast) {
            throw { statusCode: 404, message: "Podcast not found" };
        }
        if (podcast.authorId !== userId) {
            throw {
                statusCode: 403,
                message: "Not authorized to delete this podcast",
            };
        }
        await prisma_1.prisma.podcast.delete({
            where: { id },
        });
        (0, logger_1.logDatabase)("delete", "podcast", id);
        return { message: "Podcast deleted successfully" };
    }
    async getEpisodes(podcastId, userId) {
        const episodes = await prisma_1.prisma.podcastEpisode.findMany({
            where: { podcastId },
            orderBy: { episodeNumber: "asc" },
            include: {
                _count: {
                    select: {
                        comments: true,
                        favorites: true,
                    },
                },
                favorites: userId
                    ? {
                        where: {
                            OR: [{ userId }, { staffId: userId }],
                        },
                        select: { id: true },
                    }
                    : false,
                playbackProgress: userId
                    ? {
                        where: {
                            OR: [{ userId }, { staffId: userId }],
                        },
                        select: { position: true, updatedAt: true },
                    }
                    : false,
            },
        });
        // Add user-specific data and clean up response
        const episodesWithUserData = episodes.map((episode) => ({
            ...episode,
            isFavorited: userId ? episode.favorites.length > 0 : false,
            playbackProgress: userId && episode.playbackProgress.length > 0
                ? episode.playbackProgress[0]
                : null,
            favorites: undefined, // Remove from response
        }));
        return { episodes: episodesWithUserData };
    }
    async getEpisodeById(episodeId) {
        const episode = await prisma_1.prisma.podcastEpisode.findUnique({
            where: { id: episodeId },
            include: {
                podcast: {
                    select: {
                        id: true,
                        title: true,
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });
        if (!episode) {
            throw { statusCode: 404, message: "Episode not found" };
        }
        return episode;
    }
    async createEpisode(podcastId, episodeData, userId) {
        const podcast = await prisma_1.prisma.podcast.findUnique({
            where: { id: podcastId },
            select: { authorId: true },
        });
        if (!podcast) {
            throw { statusCode: 404, message: "Podcast not found" };
        }
        if (podcast.authorId !== userId) {
            throw {
                statusCode: 403,
                message: "Not authorized to add episodes to this podcast",
            };
        }
        if (!episodeData.title) {
            throw { statusCode: 400, message: "Episode title is required" };
        }
        const episode = await prisma_1.prisma.podcastEpisode.create({
            data: {
                title: episodeData.title,
                description: episodeData.description || null,
                audioFile: episodeData.audioUrl || "",
                duration: episodeData.duration || 0,
                episodeNumber: episodeData.episodeNumber || 1,
                podcast: {
                    connect: { id: podcastId },
                },
                status: "DRAFT",
            },
        });
        (0, logger_1.logDatabase)("create", "podcastEpisode", episode.id);
        return episode;
    }
    async updateEpisode(episodeId, episodeData, userId) {
        const episode = await prisma_1.prisma.podcastEpisode.findUnique({
            where: { id: episodeId },
            include: {
                podcast: {
                    select: { authorId: true },
                },
            },
        });
        if (!episode) {
            throw { statusCode: 404, message: "Episode not found" };
        }
        if (episode.podcast.authorId !== userId) {
            throw {
                statusCode: 403,
                message: "Not authorized to update this episode",
            };
        }
        // Prepare update data - only include valid fields
        const updateData = {};
        // Define valid fields that exist in the Prisma schema
        const validFields = [
            'title', 'description', 'episodeNumber', 'audioFile', 'duration',
            'status', 'transcript', 'transcriptFile', 'publishedAt'
        ];
        // Only update fields that are provided and valid
        Object.keys(episodeData).forEach(key => {
            const value = episodeData[key];
            if (value !== undefined && value !== null && validFields.includes(key)) {
                updateData[key] = value;
            }
        });
        // Convert status to uppercase if provided
        if (updateData.status) {
            updateData.status = updateData.status.toUpperCase();
        }
        // Set publishedAt when status changes to PUBLISHED
        if (updateData.status === 'PUBLISHED' && !episode.publishedAt) {
            updateData.publishedAt = new Date();
        }
        const updatedEpisode = await prisma_1.prisma.podcastEpisode.update({
            where: { id: episodeId },
            data: updateData,
        });
        (0, logger_1.logDatabase)("update", "podcastEpisode", episodeId);
        return updatedEpisode;
    }
    async deleteEpisode(episodeId, userId) {
        const episode = await prisma_1.prisma.podcastEpisode.findUnique({
            where: { id: episodeId },
            include: {
                podcast: {
                    select: { authorId: true },
                },
            },
        });
        if (!episode) {
            throw { statusCode: 404, message: "Episode not found" };
        }
        if (episode.podcast.authorId !== userId) {
            throw {
                statusCode: 403,
                message: "Not authorized to delete this episode",
            };
        }
        await prisma_1.prisma.podcastEpisode.delete({
            where: { id: episodeId },
        });
        (0, logger_1.logDatabase)("delete", "podcastEpisode", episodeId);
        return { message: "Episode deleted successfully" };
    }
    async toggleFavorite(podcastId, userId) {
        // Check if user is staff or regular user
        const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
        const staff = await prisma_1.prisma.staff.findUnique({ where: { id: userId } });
        if (!user && !staff) {
            throw { statusCode: 404, message: "User not found" };
        }
        const existing = await prisma_1.prisma.favorite.findFirst({
            where: {
                OR: [
                    { userId: user ? userId : undefined, podcastId },
                    { staffId: staff ? userId : undefined, podcastId },
                ],
            },
        });
        if (existing) {
            await prisma_1.prisma.favorite.delete({
                where: { id: existing.id },
            });
            (0, logger_1.logDatabase)("delete", "favorite", existing.id);
            return { message: "Removed from favorites", isFavorited: false };
        }
        else {
            const favorite = await prisma_1.prisma.favorite.create({
                data: {
                    ...(user ? { userId } : { staffId: userId }),
                    podcastId,
                },
            });
            (0, logger_1.logDatabase)("create", "favorite", favorite.id);
            return { message: "Added to favorites", isFavorited: true };
        }
    }
}
exports.PodcastService = PodcastService;
//# sourceMappingURL=podcast.service.js.map