import { prisma } from "../../../lib/prisma";
import { PodcastDto, PodcastEpisodeDto, PodcastQueryDto } from "../dto/podcast.dto";
import { logDatabase, logError } from "../../../utils/logger";

export class PodcastService {
  async getPodcasts(query: PodcastQueryDto) {
    const { featured = false, limit = 10, category, genreId } = query;
    
    const where: any = {
      status: "PUBLISHED"
    };

    if (category) {
      where.category = category;
    }

    if (genreId) {
      where.genreId = genreId;
    }

    const podcasts = await prisma.podcast.findMany({
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

    const podcastsWithLatestEpisode = await Promise.all(
      podcasts.map(async (podcast: any) => {
        const latestEpisode = await prisma.podcastEpisode.findFirst({
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
      })
    );

    return {
      podcasts: podcastsWithLatestEpisode,
      count: podcastsWithLatestEpisode.length
    };
  }

  async getPodcastById(id: string) {
    const podcast = await prisma.podcast.findUnique({
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

  async createPodcast(podcastData: PodcastDto, authorId: string) {
    // Convert releaseDate string to ISO-8601 DateTime
    const releaseDateTime = podcastData.releaseDate
      ? new Date(podcastData.releaseDate).toISOString()
      : new Date().toISOString();

    const podcast = await prisma.podcast.create({
      data: {
        ...podcastData,
        releaseDate: releaseDateTime,
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
    logDatabase('create', 'podcast', podcast.id);

    return podcast;
  }

  async updatePodcast(id: string, podcastData: Partial<PodcastDto>, userId: string) {
    const podcast = await prisma.podcast.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!podcast) {
      throw { statusCode: 404, message: "Podcast not found" };
    }

    if (podcast.authorId !== userId) {
      throw { statusCode: 403, message: "Not authorized to update this podcast" };
    }

    // Convert releaseDate string to ISO-8601 DateTime if provided
    const updateData = { ...podcastData };
    if (updateData.releaseDate) {
      updateData.releaseDate = new Date(updateData.releaseDate).toISOString();
    }

    const updatedPodcast = await prisma.podcast.update({
      where: { id },
      data: updateData,
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
    logDatabase('update', 'podcast', id);

    return updatedPodcast;
  }

  async deletePodcast(id: string, userId: string) {
    const podcast = await prisma.podcast.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!podcast) {
      throw { statusCode: 404, message: "Podcast not found" };
    }

    if (podcast.authorId !== userId) {
      throw { statusCode: 403, message: "Not authorized to delete this podcast" };
    }

    await prisma.podcast.delete({
      where: { id }
    });
    logDatabase('delete', 'podcast', id);

    return { message: "Podcast deleted successfully" };
  }

  async getEpisodes(podcastId: string) {
    const episodes = await prisma.podcastEpisode.findMany({
      where: { podcastId },
      orderBy: { episodeNumber: 'asc' }
    });

    return { episodes };
  }

  async getEpisodeById(episodeId: string) {
    const episode = await prisma.podcastEpisode.findUnique({
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

  async createEpisode(podcastId: string, episodeData: PodcastEpisodeDto, userId: string) {
    const podcast = await prisma.podcast.findUnique({
      where: { id: podcastId },
      select: { authorId: true }
    });

    if (!podcast) {
      throw { statusCode: 404, message: "Podcast not found" };
    }

    if (podcast.authorId !== userId) {
      throw { statusCode: 403, message: "Not authorized to add episodes to this podcast" };
    }

    const episode = await prisma.podcastEpisode.create({
      data: {
        ...episodeData,
        podcastId,
        status: "DRAFT"
      }
    });
    logDatabase('create', 'podcastEpisode', episode.id);

    return episode;
  }

  async updateEpisode(episodeId: string, episodeData: Partial<PodcastEpisodeDto>, userId: string) {
    const episode = await prisma.podcastEpisode.findUnique({
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

    const updatedEpisode = await prisma.podcastEpisode.update({
      where: { id: episodeId },
      data: episodeData
    });
    logDatabase('update', 'podcastEpisode', episodeId);

    return updatedEpisode;
  }

  async deleteEpisode(episodeId: string, userId: string) {
    const episode = await prisma.podcastEpisode.findUnique({
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

    await prisma.podcastEpisode.delete({
      where: { id: episodeId }
    });
    logDatabase('delete', 'podcastEpisode', episodeId);

    return { message: "Episode deleted successfully" };
  }

  async toggleFavorite(podcastId: string, userId: string) {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        podcastId
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      });
      logDatabase('delete', 'favorite', existing.id);
      return { message: "Removed from favorites", isFavorited: false };
    } else {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          podcastId
        }
      });
      logDatabase('create', 'favorite', favorite.id);
      return { message: "Added to favorites", isFavorited: true };
    }
  }
}