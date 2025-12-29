import { prisma } from "../../../lib/prisma";
import { ProgramDto, ProgramEpisodeDto } from "../dto/program.dto";

export class ProgramService {
  async getPrograms() {
    const programs = await prisma.program.findMany({
      include: {
        host: {
          select: { id: true, firstName: true, lastName: true }
        },
        genre: true,
        _count: {
          select: { episodes: true, broadcasts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { programs };
  }

  async getProgramById(id: string) {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        host: {
          select: { id: true, firstName: true, lastName: true }
        },
        genre: true,
        episodes: {
          orderBy: { airDate: 'desc' },
          take: 10
        },
        broadcasts: {
          orderBy: { startTime: 'desc' },
          take: 5
        }
      }
    });

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    return program;
  }

  async createProgram(programData: ProgramDto, hostId: string) {
    const program = await prisma.program.create({
      data: {
        ...programData,
        hostId,
        status: "ACTIVE"
      } as any
    });

    return program;
  }

  async updateProgram(id: string, programData: Partial<ProgramDto>, userId: string) {
    const program = await prisma.program.findUnique({
      where: { id },
      select: { hostId: true }
    });

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    if (program.hostId !== userId) {
      throw { statusCode: 403, message: "Not authorized" };
    }

    return await prisma.program.update({
      where: { id },
      data: programData as any
    });
  }

  async deleteProgram(id: string, userId: string) {
    const program = await prisma.program.findUnique({
      where: { id },
      select: { hostId: true }
    });

    if (!program) {
      throw { statusCode: 404, message: "Program not found" };
    }

    if (program.hostId !== userId) {
      throw { statusCode: 403, message: "Not authorized" };
    }

    await prisma.program.delete({ where: { id } });
    return { message: "Program deleted successfully" };
  }

  async createEpisode(programId: string, episodeData: ProgramEpisodeDto, userId: string) {
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

    return await prisma.programEpisode.create({
      data: {
        ...episodeData,
        programId
      }
    });
  }
}