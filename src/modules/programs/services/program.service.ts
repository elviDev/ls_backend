import { prisma } from "../../../lib/prisma";
import { ProgramDto, ProgramEpisodeDto, UpdateProgramEpisodeDto, ProgramQueryDto, ProgramStatus } from "../dto/program.dto";

export class ProgramService {
  async getPrograms(query: ProgramQueryDto = {}) {
    const { category, status, hostId, genreId, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (hostId) where.hostId = hostId;
    if (genreId) where.genreId = genreId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { host: { 
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ];
    }

    const [programs, total] = await Promise.all([
      prisma.program.findMany({
        where,
        include: {
          host: {
            select: { id: true, firstName: true, lastName: true, profileImage: true, bio: true }
          },
          genre: true,
          _count: {
            select: { episodes: true, broadcasts: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.program.count({ where })
    ]);

    return { 
      programs, 
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getProgramById(id: string) {
    console.log('Looking for program with ID:', id);
    let program = await prisma.program.findUnique({
      where: { id },
      include: {
        host: {
          select: { id: true, firstName: true, lastName: true, profileImage: true, bio: true }
        },
        genre: true,
        episodes: {
          orderBy: { airDate: 'desc' },
          include: {
            broadcast: {
              select: { id: true, status: true, startTime: true, endTime: true }
            }
          }
        },
        broadcasts: {
          orderBy: { startTime: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            status: true,
            startTime: true,
            endTime: true
          }
        },
        _count: {
          select: { episodes: true, broadcasts: true }
        }
      }
    });

    // If not found by ID, try to find by slug
    if (!program) {
      console.log('Program not found by ID, trying slug:', id);
      program = await prisma.program.findUnique({
        where: { slug: id },
        include: {
          host: {
            select: { id: true, firstName: true, lastName: true, profileImage: true, bio: true }
          },
          genre: true,
          episodes: {
            orderBy: { airDate: 'desc' },
            include: {
              broadcast: {
                select: { id: true, status: true, startTime: true, endTime: true }
              }
            }
          },
          broadcasts: {
            orderBy: { startTime: 'desc' },
            take: 5,
            select: {
              id: true,
              title: true,
              status: true,
              startTime: true,
              endTime: true
            }
          },
          _count: {
            select: { episodes: true, broadcasts: true }
          }
        }
      });
    }

    console.log('Found program:', program ? 'Yes' : 'No');
    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    return program;
  }

  async getProgramBySlug(slug: string) {
    console.log('Looking for program with slug:', slug);
    const program = await prisma.program.findUnique({
      where: { slug },
      include: {
        host: {
          select: { id: true, firstName: true, lastName: true, profileImage: true, bio: true }
        },
        genre: true,
        episodes: {
          orderBy: { airDate: 'desc' },
          include: {
            broadcast: {
              select: { id: true, status: true, startTime: true, endTime: true }
            }
          }
        },
        broadcasts: {
          orderBy: { startTime: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            status: true,
            startTime: true,
            endTime: true
          }
        },
        _count: {
          select: { episodes: true, broadcasts: true }
        }
      }
    });

    console.log('Found program by slug:', program ? 'Yes' : 'No');
    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    return program;
  }

  async createProgram(programData: ProgramDto, hostId: string) {
    // Generate slug from title
    const slug = programData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug is unique
    const existingProgram = await prisma.program.findUnique({
      where: { slug }
    });

    if (existingProgram) {
      throw { statusCode: 400, message: "Program slug already exists" };
    }

    const program = await prisma.program.create({
      data: {
        ...programData,
        slug,
        hostId,
        status: programData.status || "ACTIVE"
      },
      include: {
        host: {
          select: { id: true, firstName: true, lastName: true }
        },
        genre: true
      }
    });

    return program;
  }

  async updateProgram(id: string, programData: Partial<ProgramDto>) {
    const program = await prisma.program.findUnique({
      where: { id },
      select: { title: true }
    });

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    // Generate new slug if title is being updated
    const updateFields: any = { ...programData };
    if (programData.title && programData.title !== program.title) {
      const newSlug = programData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check slug uniqueness
      const existingProgram = await prisma.program.findUnique({
        where: { slug: newSlug }
      });
      if (existingProgram && existingProgram.id !== id) {
        throw { statusCode: 400, message: "Program slug already exists" };
      }
      
      updateFields.slug = newSlug;
    }

    return await prisma.program.update({
      where: { id },
      data: updateFields,
      include: {
        host: {
          select: { id: true, firstName: true, lastName: true }
        },
        genre: true
      }
    });
  }

  async deleteProgram(id: string, userId: string) {
    const program = await prisma.program.findUnique({
      where: { id },
      select: { hostId: true, _count: { select: { episodes: true, broadcasts: true } } }
    });

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    if (program.hostId !== userId) {
      throw { statusCode: 403, message: "Not authorized" };
    }

    // Check if program has episodes or broadcasts
    if (program._count.episodes > 0 || program._count.broadcasts > 0) {
      throw { statusCode: 400, message: "Cannot delete program with existing episodes or broadcasts" };
    }

    await prisma.program.delete({ where: { id } });
    return { message: "Program deleted successfully" };
  }

  async getProgramEpisodes(programId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // First check if program exists by ID, then by slug
    let program = await prisma.program.findUnique({
      where: { id: programId },
      select: { id: true }
    });

    if (!program) {
      program = await prisma.program.findUnique({
        where: { slug: programId },
        select: { id: true }
      });
    }

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    const actualProgramId = program.id;

    const [episodes, total] = await Promise.all([
      prisma.programEpisode.findMany({
        where: { programId: actualProgramId },
        include: {
          broadcast: {
            select: { id: true, status: true, startTime: true, endTime: true }
          }
        },
        orderBy: { airDate: 'desc' },
        skip,
        take: limit
      }),
      prisma.programEpisode.count({ where: { programId: actualProgramId } })
    ]);

    return {
      episodes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getEpisodeById(programId: string, episodeId: string) {
    const episode = await prisma.programEpisode.findFirst({
      where: { id: episodeId, programId },
      include: {
        program: {
          select: { id: true, title: true, hostId: true }
        },
        broadcast: true
      }
    });

    if (!episode) {
      throw { statusCode: 404, message: "Episode not found" };
    }

    return episode;
  }

  async createEpisode(programId: string, episodeData: ProgramEpisodeDto, userId: string) {
    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { hostId: true }
    });

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    // Check if user is the host or an admin
    const user = await prisma.staff.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (program.hostId !== userId && user?.role !== 'ADMIN') {
      throw { statusCode: 403, message: "Not authorized" };
    }

    // If broadcastId is provided, link the episode to the broadcast
    const episodeCreateData: any = {
      ...episodeData,
      programId
    };

    if (episodeData.broadcastId) {
      // Verify broadcast exists and belongs to this program
      const broadcast = await prisma.liveBroadcast.findUnique({
        where: { id: episodeData.broadcastId },
        select: { programId: true }
      });

      if (!broadcast || broadcast.programId !== programId) {
        throw { statusCode: 400, message: "Invalid broadcast for this program" };
      }
    }

    return await prisma.programEpisode.create({
      data: episodeCreateData,
      include: {
        broadcast: {
          select: { id: true, status: true, startTime: true, endTime: true }
        }
      }
    });
  }

  async updateEpisode(programId: string, episodeId: string, episodeData: UpdateProgramEpisodeDto, userId: string) {
    const episode = await prisma.programEpisode.findFirst({
      where: { id: episodeId, programId },
      include: {
        program: { select: { hostId: true } }
      }
    });

    if (!episode) {
      throw { statusCode: 404, message: "Episode not found" };
    }

    // Check if user is the host or an admin
    const user = await prisma.staff.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (episode.program.hostId !== userId && user?.role !== 'ADMIN') {
      throw { statusCode: 403, message: "Not authorized" };
    }

    return await prisma.programEpisode.update({
      where: { id: episodeId },
      data: episodeData,
      include: {
        broadcast: {
          select: { id: true, status: true, startTime: true, endTime: true }
        }
      }
    });
  }

  async deleteEpisode(programId: string, episodeId: string, userId: string) {
    const episode = await prisma.programEpisode.findFirst({
      where: { id: episodeId, programId },
      include: {
        program: { select: { hostId: true } }
      }
    });

    if (!episode) {
      throw { statusCode: 404, message: "Episode not found" };
    }

    // Check if user is the host or an admin
    const user = await prisma.staff.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (episode.program.hostId !== userId && user?.role !== 'ADMIN') {
      throw { statusCode: 403, message: "Not authorized" };
    }

    await prisma.programEpisode.delete({ where: { id: episodeId } });
    return { message: "Episode deleted successfully" };
  }

  async archiveProgram(id: string, userId: string) {
    return this.updateProgram(id, { status: ProgramStatus.ARCHIVED });
  }

  async activateProgram(id: string, userId: string) {
    return this.updateProgram(id, { status: ProgramStatus.ACTIVE });
  }

  async getProgramAnalytics(programId: string, userId: string) {
    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { hostId: true }
    });

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    if (program.hostId !== userId) {
      throw { statusCode: 403, message: "Not authorized" };
    }

    const [episodeStats, broadcastStats, recentActivity] = await Promise.all([
      prisma.programEpisode.aggregate({
        where: { programId },
        _count: { id: true },
        _sum: { duration: true },
        _avg: { duration: true }
      }),
      prisma.liveBroadcast.aggregate({
        where: { programId },
        _count: { id: true }
      }),
      prisma.programEpisode.findMany({
        where: { programId },
        select: {
          id: true,
          title: true,
          airDate: true,
          duration: true,
          broadcast: {
            select: { status: true }
          }
        },
        orderBy: { airDate: 'desc' },
        take: 5
      })
    ]);

    return {
      episodes: {
        total: episodeStats._count.id,
        totalDuration: episodeStats._sum.duration || 0,
        averageDuration: episodeStats._avg.duration || 0
      },
      broadcasts: {
        total: broadcastStats._count.id
      },
      recentActivity
    };
  }

  async linkEpisodeToBroadcast(programId: string, episodeId: string, broadcastId: string, userId: string) {
    const episode = await prisma.programEpisode.findFirst({
      where: { id: episodeId, programId },
      include: { program: { select: { hostId: true } } }
    });

    if (!episode) {
      throw { statusCode: 404, message: "Episode not found" };
    }

    // Check if user is the host or an admin
    const user = await prisma.staff.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (episode.program.hostId !== userId && user?.role !== 'ADMIN') {
      throw { statusCode: 403, message: "Not authorized" };
    }

    const broadcast = await prisma.liveBroadcast.findUnique({
      where: { id: broadcastId },
      select: { programId: true }
    });

    if (!broadcast || broadcast.programId !== programId) {
      throw { statusCode: 400, message: "Invalid broadcast for this program" };
    }

    return await prisma.programEpisode.update({
      where: { id: episodeId },
      data: { broadcastId },
      include: {
        broadcast: {
          select: { id: true, status: true, startTime: true, endTime: true }
        }
      }
    });
  }

  async createSchedule(programId: string, scheduleData: any, userId: string) {
    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { hostId: true }
    });

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    if (program.hostId !== userId) {
      throw { statusCode: 403, message: "Not authorized" };
    }

    return await prisma.schedule.create({
      data: {
        ...scheduleData,
        type: 'LIVE_BROADCAST',
        createdBy: userId
      }
    });
  }
}