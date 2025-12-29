"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastService = void 0;
const prisma_1 = require("../../../lib/prisma");
const logger_1 = require("../../../utils/logger");
class PodcastService {
    async getPodcasts(query) {
        const { featured = false, limit = 10, category, genreId } = query;
        const where = {
            status: "PUBLISHED"
        };
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
                        episodes: true,
                        favorites: true
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
        const podcastsWithLatestEpisode = await Promise.all(podcasts.map(async (podcast) => {
            const latestEpisode = await prisma_1.prisma.podcastEpisode.findFirst({
                where: {
                    podcastId: podcast.id,
                    status: "PUBLISHED"
                },
                orderBy: { publishedAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    duration: true,
                    publishedAt: true
                }
            });
            return {
                id: podcast.id,
                title: podcast.title,
                slug: podcast.slug,
                description: podcast.description,
                category: podcast.category,
                image: podcast.image,
                status: podcast.status,
                host: {
                    name: podcast.host,
                    author: podcast.author ? {
                        id: podcast.author.id,
                        name: `${podcast.author.firstName} ${podcast.author.lastName}`,
                        profileImage: podcast.author.profileImage
                    } : null
                },
                genre: podcast.genre,
                stats: {
                    episodes: podcast._count.episodes,
                    favorites: podcast._count.favorites
                },
                latestEpisode,
                createdAt: podcast.createdAt,
                updatedAt: podcast.updatedAt
            };
        }));
        return {
            podcasts: podcastsWithLatestEpisode,
            count: podcastsWithLatestEpisode.length
        };
    }
    async getPodcastById(id) {
        const podcast = await prisma_1.prisma.podcast.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                genre: true,
                episodes: {
                    where: { status: "PUBLISHED" },
                    orderBy: { publishedAt: "desc" },
                    take: 10
                },
                _count: {
                    select: {
                        episodes: true,
                        favorites: true
                    }
                }
            }
        });
        if (!podcast) {
            throw { statusCode: 404, message: "Podcast not found" };
        }
        return podcast;
    }
    async createPodcast(podcastData, authorId) {
        const podcast = await prisma_1.prisma.podcast.create({
            data: {
                ...podcastData,
                authorId,
                status: "DRAFT"
            },
            include: {
                author: {
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
        (0, logger_1.logDatabase)('create', 'podcast', podcast.id);
        return podcast;
    }
    async updatePodcast(id, podcastData, userId) {
        const podcast = await prisma_1.prisma.podcast.findUnique({
            where: { id },
            select: { authorId: true }
        });
        if (!podcast) {
            throw { statusCode: 404, message: "Podcast not found" };
        }
        if (podcast.authorId !== userId) {
            throw { statusCode: 403, message: "Not authorized to update this podcast" };
        }
        const updatedPodcast = await prisma_1.prisma.podcast.update({
            where: { id },
            data: podcastData,
            include: {
                author: {
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
        (0, logger_1.logDatabase)('update', 'podcast', id);
        return updatedPodcast;
    }
    async deletePodcast(id, userId) {
        const podcast = await prisma_1.prisma.podcast.findUnique({
            where: { id },
            select: { authorId: true }
        });
        if (!podcast) {
            throw { statusCode: 404, message: "Podcast not found" };
        }
        if (podcast.authorId !== userId) {
            throw { statusCode: 403, message: "Not authorized to delete this podcast" };
        }
        await prisma_1.prisma.podcast.delete({
            where: { id }
        });
        (0, logger_1.logDatabase)('delete', 'podcast', id);
        return { message: "Podcast deleted successfully" };
    }
    async getEpisodes(podcastId) {
        const episodes = await prisma_1.prisma.podcastEpisode.findMany({
            where: { podcastId },
            orderBy: { episodeNumber: 'asc' }
        });
        return { episodes };
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
                                lastName: true
                            }
                        }
                    }
                }
            }
        });
        if (!episode) {
            throw { statusCode: 404, message: "Episode not found" };
        }
        return episode;
    }
    async createEpisode(podcastId, episodeData, userId) {
        const podcast = await prisma_1.prisma.podcast.findUnique({
            where: { id: podcastId },
            select: { authorId: true }
        });
        if (!podcast) {
            throw { statusCode: 404, message: "Podcast not found" };
        }
        if (podcast.authorId !== userId) {
            throw { statusCode: 403, message: "Not authorized to add episodes to this podcast" };
        }
        const episode = await prisma_1.prisma.podcastEpisode.create({
            data: {
                ...episodeData,
                podcastId,
                status: "DRAFT"
            }
        });
        (0, logger_1.logDatabase)('create', 'podcastEpisode', episode.id);
        return episode;
    }
    async updateEpisode(episodeId, episodeData, userId) {
        const episode = await prisma_1.prisma.podcastEpisode.findUnique({
            where: { id: episodeId },
            include: {
                podcast: {
                    select: { authorId: true }
                }
            }
        });
        if (!episode) {
            throw { statusCode: 404, message: "Episode not found" };
        }
        if (episode.podcast.authorId !== userId) {
            throw { statusCode: 403, message: "Not authorized to update this episode" };
        }
        const updatedEpisode = await prisma_1.prisma.podcastEpisode.update({
            where: { id: episodeId },
            data: episodeData
        });
        (0, logger_1.logDatabase)('update', 'podcastEpisode', episodeId);
        return updatedEpisode;
    }
    async deleteEpisode(episodeId, userId) {
        const episode = await prisma_1.prisma.podcastEpisode.findUnique({
            where: { id: episodeId },
            include: {
                podcast: {
                    select: { authorId: true }
                }
            }
        });
        if (!episode) {
            throw { statusCode: 404, message: "Episode not found" };
        }
        if (episode.podcast.authorId !== userId) {
            throw { statusCode: 403, message: "Not authorized to delete this episode" };
        }
        await prisma_1.prisma.podcastEpisode.delete({
            where: { id: episodeId }
        });
        (0, logger_1.logDatabase)('delete', 'podcastEpisode', episodeId);
        return { message: "Episode deleted successfully" };
    }
    async toggleFavorite(podcastId, userId) {
        const existing = await prisma_1.prisma.favorite.findFirst({
            where: {
                userId,
                podcastId
            }
        });
        if (existing) {
            await prisma_1.prisma.favorite.delete({
                where: { id: existing.id }
            });
            (0, logger_1.logDatabase)('delete', 'favorite', existing.id);
            return { message: "Removed from favorites", isFavorited: false };
        }
        else {
            const favorite = await prisma_1.prisma.favorite.create({
                data: {
                    userId,
                    podcastId
                }
            });
            (0, logger_1.logDatabase)('create', 'favorite', favorite.id);
            return { message: "Added to favorites", isFavorited: true };
        }
    }
}
exports.PodcastService = PodcastService;
//# sourceMappingURL=podcast.service.js.map