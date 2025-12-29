import { prisma } from "../../../lib/prisma";
import { GenreDto } from "../dto/genre.dto";

export class GenreService {
  async getGenres() {
    const genres = await prisma.genre.findMany({
      include: {
        _count: {
          select: {
            podcasts: true,
            audiobooks: true,
            programs: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return { genres };
  }

  async getGenreById(id: string) {
    const genre = await prisma.genre.findUnique({
      where: { id },
      include: {
        podcasts: {
          where: { status: "PUBLISHED" },
          take: 10,
          select: {
            id: true,
            title: true,
            coverImage: true,
            createdAt: true
          }
        },
        audiobooks: {
          where: { status: "PUBLISHED" },
          take: 10,
          select: {
            id: true,
            title: true,
            coverImage: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            podcasts: true,
            audiobooks: true,
            programs: true
          }
        }
      }
    });

    if (!genre) {
      throw { statusCode: 404, message: "Genre not found" };
    }

    return genre;
  }

  async createGenre(genreData: GenreDto) {
    const existingGenre = await prisma.genre.findFirst({
      where: {
        OR: [
          { name: genreData.name },
          { slug: genreData.slug }
        ]
      }
    });

    if (existingGenre) {
      throw { statusCode: 400, message: "Genre name or slug already exists" };
    }

    const genre = await prisma.genre.create({
      data: genreData
    });

    return genre;
  }

  async updateGenre(id: string, genreData: Partial<GenreDto>) {
    const genre = await prisma.genre.update({
      where: { id },
      data: genreData
    });

    return genre;
  }

  async deleteGenre(id: string) {
    // Check if genre is being used
    const usage = await prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            podcasts: true,
            audiobooks: true,
            programs: true
          }
        }
      }
    });

    if (!usage) {
      throw { statusCode: 404, message: "Genre not found" };
    }

    const totalUsage = usage._count.podcasts + usage._count.audiobooks + usage._count.programs;
    if (totalUsage > 0) {
      throw { statusCode: 400, message: "Cannot delete genre that is being used by content" };
    }

    await prisma.genre.delete({
      where: { id }
    });

    return { message: "Genre deleted successfully" };
  }
}