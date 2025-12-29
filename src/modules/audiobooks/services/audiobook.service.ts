import { prisma } from "../../../lib/prisma";
import { AudiobookDto, ChapterDto, AudiobookQueryDto } from "../dto/audiobook.dto";

export class AudiobookService {
  async getAudiobooks(query: AudiobookQueryDto) {
    const { featured = false, limit = 10, genreId, author, language } = query;
    
    const where: any = {
      status: "PUBLISHED"
    };

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

  async getAudiobookById(id: string) {
    const audiobook = await prisma.audiobook.findUnique({
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

  async createAudiobook(audiobookData: AudiobookDto, createdById: string) {
    const audiobook = await prisma.audiobook.create({
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

  async updateAudiobook(id: string, audiobookData: Partial<AudiobookDto>, userId: string) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id },
      select: { createdById: true }
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    if (audiobook.createdById !== userId) {
      throw { statusCode: 403, message: "Not authorized to update this audiobook" };
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
            profileImage: true 
          }
        },
        genre: true
      }
    });

    return updatedAudiobook;
  }

  async deleteAudiobook(id: string, userId: string) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id },
      select: { createdById: true }
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    if (audiobook.createdById !== userId) {
      throw { statusCode: 403, message: "Not authorized to delete this audiobook" };
    }

    await prisma.audiobook.delete({
      where: { id }
    });

    return { message: "Audiobook deleted successfully" };
  }

  async getChapters(audiobookId: string) {
    const chapters = await prisma.chapter.findMany({
      where: { audiobookId },
      orderBy: { trackNumber: 'asc' }
    });

    return { chapters };
  }

  async createChapter(audiobookId: string, chapterData: ChapterDto, userId: string) {
    const audiobook = await prisma.audiobook.findUnique({
      where: { id: audiobookId },
      select: { createdById: true }
    });

    if (!audiobook) {
      throw { statusCode: 404, message: "Audiobook not found" };
    }

    if (audiobook.createdById !== userId) {
      throw { statusCode: 403, message: "Not authorized to add chapters to this audiobook" };
    }

    const chapter = await prisma.chapter.create({
      data: {
        ...chapterData,
        audiobookId,
        status: "DRAFT"
      }
    });

    return chapter;
  }

  async toggleFavorite(audiobookId: string, userId: string) {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        audiobookId
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      });
      return { message: "Removed from favorites", isFavorited: false };
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          audiobookId
        }
      });
      return { message: "Added to favorites", isFavorited: true };
    }
  }
}