"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastService = void 0;
const prisma_1 = require("../../../lib/prisma");
class BroadcastService {
    constructor() {
        console.log('📡 BroadcastService initialized, prisma:', !!prisma_1.prisma);
    }
    async getBroadcasts(query) {
        try {
            const { status, limit = 10, programId } = query;
            const where = {};
            const now = new Date();
            if (programId) {
                where.programId = programId;
            }
            if (status === 'SCHEDULED') {
                where.status = 'SCHEDULED';
            }
            else if (status === 'LIVE') {
                where.status = 'LIVE';
            }
            else if (status === 'ENDED') {
                where.status = 'ENDED';
            }
            else if (status === 'READY') {
                where.status = 'READY';
            }
            const broadcasts = await prisma_1.prisma.liveBroadcast.findMany({
                where,
                include: {
                    program: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            image: true
                        }
                    },
                    hostUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    },
                    banner: {
                        select: {
                            id: true,
                            url: true
                        }
                    }
                },
                orderBy: { startTime: status === 'ENDED' ? 'desc' : 'asc' },
                take: limit
            });
            return broadcasts;
        }
        catch (error) {
            console.error('Database error in getBroadcasts:', error);
            return [];
        }
    }
    async getCurrentBroadcast() {
        try {
            const now = new Date();
            const broadcast = await prisma_1.prisma.liveBroadcast.findFirst({
                where: {
                    status: 'LIVE'
                },
                include: {
                    program: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            image: true,
                            description: true
                        }
                    },
                    hostUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    }
                }
            });
            return broadcast;
        }
        catch (error) {
            console.error('Database error in getCurrentBroadcast:', error);
            return null;
        }
    }
    async getUpcomingBroadcasts(limit = 5) {
        try {
            const now = new Date();
            const broadcasts = await prisma_1.prisma.liveBroadcast.findMany({
                where: {
                    status: 'SCHEDULED'
                },
                include: {
                    program: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            image: true
                        }
                    },
                    hostUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    }
                },
                orderBy: { startTime: 'asc' },
                take: limit
            });
            return broadcasts;
        }
        catch (error) {
            console.error('Database error in getUpcomingBroadcasts:', error);
            return [];
        }
    }
    async getBroadcastEvents() {
        try {
            const now = new Date();
            const liveBroadcast = await prisma_1.prisma.liveBroadcast.findFirst({
                where: {
                    status: 'LIVE'
                },
                include: {
                    program: { select: { id: true, title: true, slug: true, image: true } },
                    hostUser: { select: { id: true, firstName: true, lastName: true, profileImage: true } }
                }
            });
            const upcomingBroadcast = await prisma_1.prisma.liveBroadcast.findFirst({
                where: { status: 'SCHEDULED' },
                include: {
                    program: { select: { id: true, title: true, slug: true, image: true } },
                    hostUser: { select: { id: true, firstName: true, lastName: true, profileImage: true } }
                },
                orderBy: { startTime: 'asc' }
            });
            return { live: liveBroadcast, upcoming: upcomingBroadcast };
        }
        catch (error) {
            console.error('Database error in getBroadcastEvents:', error);
            return { live: null, upcoming: null };
        }
    }
    async createBroadcast(broadcastData, createdById) {
        try {
            // Create the broadcast first
            const broadcast = await prisma_1.prisma.liveBroadcast.create({
                data: {
                    title: broadcastData.title,
                    description: broadcastData.description,
                    startTime: new Date(broadcastData.startTime),
                    endTime: new Date(broadcastData.endTime),
                    hostId: broadcastData.hostId,
                    programId: broadcastData.programId,
                    bannerId: broadcastData.bannerId,
                    slug: this.generateSlug(broadcastData.title)
                }
            });
            // Create staff assignments if provided
            if (broadcastData.staff && broadcastData.staff.length > 0) {
                await prisma_1.prisma.broadcastStaff.createMany({
                    data: broadcastData.staff.map(staffMember => ({
                        broadcastId: broadcast.id,
                        userId: staffMember.userId,
                        role: staffMember.role
                    }))
                });
            }
            // Create guest entries if provided
            if (broadcastData.guests && broadcastData.guests.length > 0) {
                await prisma_1.prisma.broadcastGuest.createMany({
                    data: broadcastData.guests.map(guest => ({
                        broadcastId: broadcast.id,
                        name: guest.name,
                        title: guest.title,
                        role: guest.role
                    }))
                });
            }
            // Return broadcast with all relations
            return await prisma_1.prisma.liveBroadcast.findUnique({
                where: { id: broadcast.id },
                include: {
                    program: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            image: true
                        }
                    },
                    hostUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    },
                    banner: {
                        select: {
                            id: true,
                            url: true
                        }
                    },
                    staff: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    },
                    guests: true
                }
            });
        }
        catch (error) {
            console.error('Database error in createBroadcast:', error);
            throw { statusCode: 500, message: 'Failed to create broadcast' };
        }
    }
    async getBroadcastById(id) {
        try {
            return await prisma_1.prisma.liveBroadcast.findUnique({
                where: { id },
                include: {
                    program: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            image: true
                        }
                    },
                    hostUser: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    },
                    banner: {
                        select: {
                            id: true,
                            url: true
                        }
                    },
                    staff: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    },
                    guests: true
                }
            });
        }
        catch (error) {
            console.error('Database error in getBroadcastById:', error);
            return null;
        }
    }
    async deleteBroadcast(id, userId) {
        try {
            await prisma_1.prisma.liveBroadcast.delete({
                where: { id }
            });
            return { message: 'Broadcast deleted successfully' };
        }
        catch (error) {
            console.error('Database error in deleteBroadcast:', error);
            throw { statusCode: 500, message: 'Failed to delete broadcast' };
        }
    }
    async updateBroadcast(id, broadcastData, userId) {
        try {
            // Update the broadcast
            const broadcast = await prisma_1.prisma.liveBroadcast.update({
                where: { id },
                data: {
                    title: broadcastData.title,
                    description: broadcastData.description,
                    startTime: broadcastData.startTime ? new Date(broadcastData.startTime) : undefined,
                    endTime: broadcastData.endTime ? new Date(broadcastData.endTime) : undefined,
                    hostId: broadcastData.hostId,
                    programId: broadcastData.programId,
                    bannerId: broadcastData.bannerId
                }
            });
            // Update staff if provided
            if (broadcastData.staff) {
                await prisma_1.prisma.broadcastStaff.deleteMany({ where: { broadcastId: id } });
                if (broadcastData.staff.length > 0) {
                    await prisma_1.prisma.broadcastStaff.createMany({
                        data: broadcastData.staff.map(staffMember => ({
                            broadcastId: id,
                            userId: staffMember.userId,
                            role: staffMember.role
                        }))
                    });
                }
            }
            // Update guests if provided
            if (broadcastData.guests) {
                await prisma_1.prisma.broadcastGuest.deleteMany({ where: { broadcastId: id } });
                if (broadcastData.guests.length > 0) {
                    await prisma_1.prisma.broadcastGuest.createMany({
                        data: broadcastData.guests.map(guest => ({
                            broadcastId: id,
                            name: guest.name,
                            title: guest.title,
                            role: guest.role
                        }))
                    });
                }
            }
            return await prisma_1.prisma.liveBroadcast.findUnique({
                where: { id },
                include: {
                    program: { select: { id: true, title: true, slug: true, image: true } },
                    hostUser: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
                    banner: { select: { id: true, url: true } },
                    staff: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
                    guests: true
                }
            });
        }
        catch (error) {
            console.error('Database error in updateBroadcast:', error);
            throw { statusCode: 500, message: 'Failed to update broadcast' };
        }
    }
    async startBroadcast(id, userId) {
        try {
            return await prisma_1.prisma.liveBroadcast.update({
                where: { id },
                data: { status: 'LIVE' }
            });
        }
        catch (error) {
            console.error('Database error in startBroadcast:', error);
            throw { statusCode: 500, message: 'Failed to start broadcast' };
        }
    }
    async endBroadcast(id, userId) {
        try {
            return await prisma_1.prisma.liveBroadcast.update({
                where: { id },
                data: { status: 'ENDED' }
            });
        }
        catch (error) {
            console.error('Database error in endBroadcast:', error);
            throw { statusCode: 500, message: 'Failed to end broadcast' };
        }
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            + '-' + Date.now();
    }
}
exports.BroadcastService = BroadcastService;
//# sourceMappingURL=broadcast.service.js.map