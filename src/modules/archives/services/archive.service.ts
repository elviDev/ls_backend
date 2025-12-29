import { prisma } from "../../../lib/prisma";
import { ArchiveDto, ArchiveQueryDto } from "../dto/archive.dto";

export class ArchiveService {
  async getArchives(query: ArchiveQueryDto) {
    const { type, category, featured, limit = 10, search } = query;
    
    const where: any = {
      status: "ACTIVE"
    };

    if (type) where.type = type;
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { host: { contains: search, mode: "insensitive" } }
      ];
    }

    const archives = await prisma.archive.findMany({
      where,
      include: {
        createdBy: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true 
          }
        },
        _count: {
          select: {
            favorites: true,
            comments: true,
            reviews: true
          }
        }
      },
      orderBy: featured 
        ? [{ isFeatured: "desc" }, { createdAt: "desc" }]
        : { originalAirDate: "desc" },
      take: limit
    });

    return { archives, count: archives.length };
  }

  async getArchiveById(id: string) {
    const archive = await prisma.archive.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true 
          }
        },
        podcast: {
          select: { id: true, title: true }
        },
        audiobook: {
          select: { id: true, title: true }
        },
        broadcast: {
          select: { id: true, title: true }
        },
        _count: {
          select: {
            favorites: true,
            comments: true,
            reviews: true
          }
        }
      }
    });

    if (!archive) {
      throw { statusCode: 404, message: "Archive not found" };
    }

    return archive;
  }

  async createArchive(archiveData: ArchiveDto, createdById: string) {
    const archive = await prisma.archive.create({
      data: {
        ...archiveData,
        createdById,
        status: "ACTIVE",
        archivedDate: new Date()
      } as any,
      include: {
        createdBy: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true 
          }
        }
      }
    });

    return archive;
  }

  async updateArchive(id: string, archiveData: Partial<ArchiveDto>, userId: string) {
    const archive = await prisma.archive.findUnique({
      where: { id },
      select: { createdById: true }
    });

    if (!archive) {
      throw { statusCode: 404, message: "Archive not found" };
    }

    if (archive.createdById !== userId) {
      throw { statusCode: 403, message: "Not authorized to update this archive" };
    }

    const updatedArchive = await prisma.archive.update({
      where: { id },
      data: archiveData as any
    });

    return updatedArchive;
  }

  async deleteArchive(id: string, userId: string) {
    const archive = await prisma.archive.findUnique({
      where: { id },
      select: { createdById: true }
    });

    if (!archive) {
      throw { statusCode: 404, message: "Archive not found" };
    }

    if (archive.createdById !== userId) {
      throw { statusCode: 403, message: "Not authorized to delete this archive" };
    }

    await prisma.archive.delete({
      where: { id }
    });

    return { message: "Archive deleted successfully" };
  }

  async toggleFavorite(archiveId: string, userId: string) {
    const existing = await prisma.favorite.findFirst({
      where: {
        userId,
        archiveId
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
          archiveId
        }
      });
      return { message: "Added to favorites", isFavorited: true };
    }
  }
}