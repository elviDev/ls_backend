"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramService = void 0;
const prisma_1 = require("../../../lib/prisma");
class ProgramService {
    async getPrograms() {
        const programs = await prisma_1.prisma.program.findMany({
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
    async getProgramById(id) {
        const program = await prisma_1.prisma.program.findUnique({
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
    async createProgram(programData, hostId) {
        const program = await prisma_1.prisma.program.create({
            data: {
                ...programData,
                hostId,
                status: "ACTIVE"
            }
        });
        return program;
    }
    async updateProgram(id, programData, userId) {
        const program = await prisma_1.prisma.program.findUnique({
            where: { id },
            select: { hostId: true }
        });
        if (!program) {
            throw { statusCode: 404, message: "Program not found" };
        }
        if (program.hostId !== userId) {
            throw { statusCode: 403, message: "Not authorized" };
        }
        return await prisma_1.prisma.program.update({
            where: { id },
            data: programData
        });
    }
    async deleteProgram(id, userId) {
        const program = await prisma_1.prisma.program.findUnique({
            where: { id },
            select: { hostId: true }
        });
        if (!program) {
            throw { statusCode: 404, message: "Program not found" };
        }
        if (program.hostId !== userId) {
            throw { statusCode: 403, message: "Not authorized" };
        }
        await prisma_1.prisma.program.delete({ where: { id } });
        return { message: "Program deleted successfully" };
    }
    async createEpisode(programId, episodeData, userId) {
        const program = await prisma_1.prisma.program.findUnique({
            where: { id: programId },
            select: { hostId: true }
        });
        if (!program) {
            throw { statusCode: 404, message: "Program not found" };
        }
        if (program.hostId !== userId) {
            throw { statusCode: 403, message: "Not authorized" };
        }
        return await prisma_1.prisma.programEpisode.create({
            data: {
                ...episodeData,
                programId
            }
        });
    }
}
exports.ProgramService = ProgramService;
//# sourceMappingURL=program.service.js.map