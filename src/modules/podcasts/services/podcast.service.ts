import { prisma } from "../../../lib/prisma";
import {
  PodcastDto,
  PodcastEpisodeDto,
  PodcastQueryDto,
} from "../dto/podcast.dto";
import { logDatabase, logError } from "../../../utils/logger";
import { Prisma } from "@prisma/client";

export class PodcastService {
  async getPodcasts(query: PodcastQueryDto, userId?: string) {
    const { featured = false, limit = 10, category, genreId, status } = query;

    const where: any = {};

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

    const podcasts = await prisma.podcast.findMany({
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

    const podcastsWithData = await Promise.all(
      podcasts.map(async (podcast: any) => {
        const latestEpisode = await prisma.podcastEpisode.findFirst({
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
      })
    );

    return {
      podcasts: podcastsWithData,
      count: podcastsWithData.length,
    };
  }

  async getPodcastById(id: string, userId?: string) {
    const podcast = (await prisma.podcast.findUnique({
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
    })) as unknown as any;

    if (!podcast) {
      throw { statusCode: 404, message: "Podcast not found" };
    }

    // Process episodes with user-specific data
    const episodesWithUserData = podcast.episodes.map((episode) => ({
      ...episode,
      isFavorited: userId ? episode.favorites.length > 0 : false,
      playbackProgress:
        userId && episode.playbackProgress.length > 0
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
      playbackProgress:
        userId && podcast.playbackProgress.length > 0
          ? podcast.playbackProgress[0]
          : null,
      userReview:
        userId && podcast.reviews.length > 0 ? podcast.reviews[0] : null,
      recentReviews: podcast.reviews, // Always include all reviews
    };

    // Clean up response - only remove raw relation arrays
    delete result.favorites;
    delete result.bookmarks;

    return result;
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
        status: "DRAFT",
      } as any,
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
    logDatabase("create", "podcast", podcast.id);

    return podcast;
  }

  async updatePodcast(
    id: string,
    podcastData: Partial<PodcastDto>,
    userId: string
  ) {
    const podcast = await prisma.podcast.findUnique({
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

    // Convert releaseDate string to ISO-8601 DateTime if provided
    const updateData = { ...podcastData };
    if (updateData.releaseDate) {
      updateData.releaseDate = new Date(updateData.releaseDate).toISOString();
    }

    console.log("Service updating podcast with data:", updateData);

    const updatedPodcast = await prisma.podcast.update({
      where: { id },
      data: updateData as any,
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

    console.log("Updated podcast result:", updatedPodcast);
    logDatabase("update", "podcast", id);

    // Add hostId field for consistency
    const result = {
      ...updatedPodcast,
      hostId: (updatedPodcast as any).host?.id || (updatedPodcast as any).host,
    };

    return result;
  }

  async deletePodcast(id: string, userId: string) {
    const podcast = await prisma.podcast.findUnique({
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

    await prisma.podcast.delete({
      where: { id },
    });
    logDatabase("delete", "podcast", id);

    return { message: "Podcast deleted successfully" };
  }

  async getEpisodes(podcastId: string, userId?: string) {
    const episodes = await prisma.podcastEpisode.findMany({
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
      playbackProgress:
        userId && episode.playbackProgress.length > 0
          ? episode.playbackProgress[0]
          : null,
      favorites: undefined, // Remove from response
    }));

    return { episodes: episodesWithUserData };
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

  async createEpisode(
    podcastId: string,
    episodeData: PodcastEpisodeDto,
    userId: string
  ) {
    const podcast = await prisma.podcast.findUnique({
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

    const episode = await prisma.podcastEpisode.create({
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
    logDatabase("create", "podcastEpisode", episode.id);

    return episode;
  }

  async updateEpisode(
    episodeId: string,
    episodeData: Partial<PodcastEpisodeDto>,
    userId: string
  ) {
    const episode = await prisma.podcastEpisode.findUnique({
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

    const updatedEpisode = await prisma.podcastEpisode.update({
      where: { id: episodeId },
      data: episodeData,
    });
    logDatabase("update", "podcastEpisode", episodeId);

    return updatedEpisode;
  }

  async deleteEpisode(episodeId: string, userId: string) {
    const episode = await prisma.podcastEpisode.findUnique({
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

    await prisma.podcastEpisode.delete({
      where: { id: episodeId },
    });
    logDatabase("delete", "podcastEpisode", episodeId);

    return { message: "Episode deleted successfully" };
  }

  async toggleFavorite(podcastId: string, userId: string) {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        podcastId,
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      logDatabase("delete", "favorite", existing.id);
      return { message: "Removed from favorites", isFavorited: false };
    } else {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          podcastId,
        },
      });
      logDatabase("create", "favorite", favorite.id);
      return { message: "Added to favorites", isFavorited: true };
    }
  }
}
