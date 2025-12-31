import { prisma } from "../../../lib/prisma";
import { AssetService } from "../../assets/services/asset.service";
import {
  AudiobookDto,
  ChapterDto,
  AudiobookQueryDto,
} from "../dto/audiobook.dto";

export class AudiobookService {
  async getAudiobooks(query: AudiobookQueryDto, userId?: string) {
    const {
      featured = false,
      limit = 10,
      genreId,
      author,
      language,
      status,
    } = query;

    const where: any = {};

    // Only filter by status if explicitly provided, otherwise show all
    if (status) {
      where.status = status;
    }

    if (genreId) where.genreId = genreId;
    if (author) where.author = { contains: author, mode: "insensitive" };
    if (language) where.language = language;

    const audiobooks = await prisma.audiobook.findMany({
      where,
      include: {
        createdBy: {
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
        chapters: {
          select: {
            duration: true,
          },
        },
        _count: {
          select: {
            chapters: true,
            favorites: true,
            reviews: true,
            comments: true,
            bookmarks: true,
          },
        },
        favorites: userId ? {
          where: { 
            OR: [
              { userId },
              { staffId: userId }
            ]
          },
          select: { id: true }
        } : false,
        reviews: {
          select: { 
            id: true, 
            rating: true, 
            comment: true, 
            createdAt: true, 
            user: { select: { name: true } } 
          },
          take: 3,
          orderBy: { createdAt: 'desc' }
        },
        comments: {
          select: { 
            id: true, 
            content: true, 
            createdAt: true, 
            user: { select: { name: true } } 
          },
          take: 3,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: featured
        ? [{ favorites: { _count: "desc" } }, { createdAt: "desc" }]
        : { createdAt: "desc" },
      take: limit,
    });

    // Calculate actual duration from chapters and add user-specific data
    const audiobooksWithData = audiobooks.map((audiobook) => {
      const calculatedDuration = audiobook.chapters.reduce(
        (total, chapter) => total + (chapter.duration || 0),
        0
      );
      return {
        ...audiobook,
        duration: calculatedDuration,
        isFavorited: userId ? audiobook.favorites.length > 0 : false,
        recentReviews: audiobook.reviews,
        recentComments: audiobook.comments,
        chapters: undefined, // Remove chapters from response to keep it clean
        favorites: undefined, // Remove from response
        reviews: undefined,
        comments: undefined,
      };
    });

    return {
      audiobooks: audiobooksWithData,
      count: audiobooksWithData.length,
    };
  }

  async getAudiobookById(id: string, userId?: string) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            bio: true,
          },
        },
        genre: true,
        chapters: {
          orderBy: { trackNumber: "asc" },
        },
        _count: {
          select: {
            chapters: true,
            favorites: true,
            reviews: true,
            comments: true,
            bookmarks: true,
          },
        },
        favorites: userId ? {
          where: { 
            OR: [
              { userId },
              { staffId: userId }
            ]
          },
          select: { id: true }
        } : false,
        bookmarks: userId ? {
          where: { userId },
          select: { id: true, position: true, createdAt: true }
        } : false,
        playbackProgress: userId ? {
          where: {
            OR: [
              { userId },
              { staffId: userId }
            ]
          },
          select: { position: true, updatedAt: true, chapterId: true }
        } : false,
        reviews: {
          select: { 
            id: true, 
            rating: true, 
            comment: true, 
            createdAt: true, 
            user: { select: { name: true } } 
          },
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        comments: {
          select: { 
            id: true, 
            content: true, 
            createdAt: true, 
            user: { select: { name: true } } 
          },
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    // Add user-specific fields
    const result = {
      ...audiobook,
      isFavorited: userId ? audiobook.favorites.length > 0 : false,
      isBookmarked: userId ? audiobook.bookmarks.length > 0 : false,
      userBookmarks: userId ? audiobook.bookmarks : [],
      playbackProgress: userId && audiobook.playbackProgress.length > 0 ? audiobook.playbackProgress : [],
      recentReviews: audiobook.reviews,
      recentComments: audiobook.comments
    };

    // Clean up response
    delete result.favorites;
    delete result.bookmarks;
    delete result.reviews;
    delete result.comments;

    return result;
  }

  async createAudiobook(audiobookData: AudiobookDto, createdById: string) {
    // Generate slug from title if not provided
    const slug =
      audiobookData.slug ||
      audiobookData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Convert tags array to string if it's an array
    const tags = Array.isArray(audiobookData.tags)
      ? audiobookData.tags.join(",")
      : audiobookData.tags;

    const audiobook = await prisma.audiobook.create({
      data: {
        ...audiobookData,
        slug,
        duration: audiobookData.duration || 0,
        releaseDate: new Date(audiobookData.releaseDate),
        tags,
        createdById,
        status: "DRAFT",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        genre: true,
      },
    });

    return audiobook;
  }

  async updateAudiobook(
    id: string,
    audiobookData: Partial<AudiobookDto>,
    userId: string
  ) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    if (audiobook.createdById !== userId) {
      throw {
        statusCode: 403,
        message: "Not authorized to update this audiobook",
      };
    }

    const updatedAudiobook = await prisma.audiobook.update({
      where: { id },
      data: audiobookData,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        genre: true,
      },
    });

    return updatedAudiobook;
  }

  async deleteAudiobook(id: string, userId: string) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    if (audiobook.createdById !== userId) {
      throw {
        statusCode: 403,
        message: "Not authorized to delete this audiobook",
      };
    }

    await prisma.audiobook.delete({
      where: { id },
    });

    return { message: "Audiobook deleted successfully" };
  }

  async getChapters(audiobookId: string) {
    const chapters = await prisma.chapter.findMany({
      where: { audiobookId },
      orderBy: { trackNumber: "asc" },
    });

    return { chapters };
  }

  async getChapter(audiobookId: string, chapterId: string) {
    const chapter = await prisma.chapter.findFirst({
      where: { 
        id: chapterId,
        audiobookId 
      },
    });

    if (!chapter) {
      throw { statusCode: 404, message: "Chapter not found" };
    }

    return chapter;
  }

  async createChapter(
    audiobookId: string,
    chapterData: ChapterDto,
    userId: string,
    audioFile: Express.Multer.File
  ) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id: audiobookId },
      select: { createdById: true },
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    if (audiobook.createdById !== userId) {
      throw {
        statusCode: 403,
        message: "Not authorized to add chapters to this audiobook",
      };
    }

    let updatedChapterData = { ...chapterData };
    if (audioFile) {
      const assetService = new AssetService();
      const asset = await assetService.createAsset(audioFile, userId, {
        type: "AUDIO",
      });
      updatedChapterData.audioFile = asset.url;
    }

    const chapter = await prisma.chapter.create({
      data: {
        title: updatedChapterData.title || "Untitled Chapter",
        audioFile: updatedChapterData.audioFile || "",
        duration: updatedChapterData.duration || 0,
        trackNumber: updatedChapterData.trackNumber || 1,
        ...updatedChapterData,
        audiobookId,
        status: "DRAFT",
      },
    });

    // Update audiobook duration
    await this.updateAudiobookDuration(audiobookId);

    return chapter;
  }

  async getAudiobookStats() {
    const [
      total,
      published,
      draft,
      archived,
      totalChapters,
      totalPlays,
      avgRating,
    ] = await Promise.all([
      prisma.audiobook.count(),
      prisma.audiobook.count({ where: { status: "PUBLISHED" } }),
      prisma.audiobook.count({ where: { status: "DRAFT" } }),
      prisma.audiobook.count({ where: { status: "ARCHIVED" } }),
      prisma.chapter.count(),
      prisma.audiobook.aggregate({ _sum: { playCount: true } }),
      prisma.review.aggregate({
        where: { audiobookId: { not: null } },
        _avg: { rating: true },
      }),
    ]);

    const totalDuration = await prisma.audiobook.aggregate({
      _sum: { duration: true },
    });

    const topGenres = await prisma.audiobook.groupBy({
      by: ["genreId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    const genreNames = await prisma.genre.findMany({
      where: {
        id: { in: topGenres.map((g) => g.genreId) },
      },
      select: { id: true, name: true },
    });

    const topGenresWithNames = topGenres.map((g) => {
      const genre = genreNames.find((gn) => gn.id === g.genreId);
      return {
        name: genre?.name || "Unknown",
        count: g._count.id,
      };
    });

    return {
      total,
      published,
      draft,
      archived,
      totalChapters,
      totalDuration: totalDuration._sum.duration || 0,
      totalPlays: totalPlays._sum.playCount || 0,
      averageRating: avgRating._avg.rating || 0,
      topGenres: topGenresWithNames,
    };
  }

  async toggleFavorite(audiobookId: string, userId: string) {
    const existing = await prisma.favorite.findFirst({
      where: {
        OR: [
          { userId, audiobookId },
          { staffId: userId, audiobookId }
        ]
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return { message: "Removed from favorites", isFavorited: false };
    } else {
      // Try to create with staffId first (for staff users), fallback to userId
      try {
        const favorite = await prisma.favorite.create({
          data: {
            staffId: userId,
            audiobookId,
          },
        });
        return { message: "Added to favorites", isFavorited: true };
      } catch (error) {
        // If staffId fails, try userId
        const favorite = await prisma.favorite.create({
          data: {
            userId,
            audiobookId,
          },
        });
        return { message: "Added to favorites", isFavorited: true };
      }
    }
  }

  async saveProgress(audiobookId: string, userId: string, position: number, chapterId?: string) {
    const existing = await prisma.playbackProgress.findFirst({
      where: {
        OR: [
          { userId, audiobookId },
          { staffId: userId, audiobookId }
        ]
      },
    });

    if (existing) {
      const updated = await prisma.playbackProgress.update({
        where: { id: existing.id },
        data: {
          position,
          chapterId,
          updatedAt: new Date(),
        },
      });
      return { message: "Progress saved", data: updated };
    } else {
      // Try to create with staffId first (for staff users), fallback to userId
      try {
        const progress = await prisma.playbackProgress.create({
          data: {
            staffId: userId,
            audiobookId,
            position,
            chapterId,
          },
        });
        return { message: "Progress saved", data: progress };
      } catch (error) {
        // If staffId fails, try userId
        const progress = await prisma.playbackProgress.create({
          data: {
            userId,
            audiobookId,
            position,
            chapterId,
          },
        });
        return { message: "Progress saved", data: progress };
      }
    }
  }

  async getProgress(audiobookId: string, userId: string) {
    const progress = await prisma.playbackProgress.findFirst({
      where: {
        OR: [
          { userId, audiobookId },
          { staffId: userId, audiobookId }
        ]
      },
    });

    return { data: progress };
  }

  async updateChapter(
    audiobookId: string,
    chapterId: string,
    chapterData: Partial<ChapterDto>,
    userId: string,
    audioFile?: Express.Multer.File
  ) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id: audiobookId },
      select: { createdById: true, status: true },
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    if (audiobook.createdById !== userId) {
      throw {
        statusCode: 403,
        message: "Not authorized to update chapters in this audiobook",
      };
    }

    if (audioFile && audiobook.status === "PUBLISHED") {
      throw {
        statusCode: 400,
        message: "Cannot change audio file of published audiobook",
      };
    }

    let updatedChapterData = { ...chapterData };
    if (audioFile) {
      const { AssetService } = await import(
        "../../assets/services/asset.service"
      );
      const assetService = new AssetService();
      const asset = await assetService.createAsset(audioFile, userId, {
        type: "AUDIO",
      });
      updatedChapterData.audioFile = asset.url;
    }

    const chapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: updatedChapterData,
    });

    if (chapterData.duration !== undefined) {
      await this.updateAudiobookDuration(audiobookId);
    }

    return chapter;
  }

  async deleteChapter(audiobookId: string, chapterId: string, userId: string) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id: audiobookId },
      select: { createdById: true },
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    if (audiobook.createdById !== userId) {
      throw {
        statusCode: 403,
        message: "Not authorized to delete chapters in this audiobook",
      };
    }

    await prisma.chapter.delete({
      where: { id: chapterId },
    });

    // Update audiobook duration after deleting chapter
    await this.updateAudiobookDuration(audiobookId);

    return { message: "Chapter deleted successfully" };
  }

  // Helper method to update audiobook duration based on chapters
  private async updateAudiobookDuration(audiobookId: string) {
    const result = await prisma.chapter.aggregate({
      where: { audiobookId },
      _sum: { duration: true },
    });

    const totalDuration = result._sum.duration || 0;

    await prisma.audiobook.update({
      where: { id: audiobookId },
      data: { duration: totalDuration },
    });
  }

  async toggleBookmark(audiobookId: string, userId: string) {
    const existing = await prisma.bookmark.findFirst({
      where: {
        userId,
        audiobookId,
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return { message: "Bookmark removed", bookmarked: false };
    } else {
      const bookmark = await prisma.bookmark.create({
        data: {
          userId,
          audiobookId,
          position: 0, // Default position
        },
      });
      return { message: "Bookmarked", bookmarked: true };
    }
  }
}
