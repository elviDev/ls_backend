"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../../../lib/prisma");
class AnalyticsService {
    async getContentAnalytics(query) {
        const { startDate, endDate } = query;
        const dateFilter = this.getDateFilter(startDate, endDate);
        const [totalPodcasts, totalAudiobooks, totalArchives, topPodcasts, topAudiobooks] = await Promise.all([
            prisma_1.prisma.podcast.count({ where: { status: "PUBLISHED", ...dateFilter } }),
            prisma_1.prisma.audiobook.count({ where: { status: "PUBLISHED", ...dateFilter } }),
            prisma_1.prisma.archive.count({ where: { status: "ACTIVE", ...dateFilter } }),
            prisma_1.prisma.podcast.findMany({
                where: { status: "PUBLISHED" },
                select: { id: true, title: true, playCount: true },
                orderBy: { playCount: 'desc' },
                take: 10
            }),
            prisma_1.prisma.audiobook.findMany({
                where: { status: "PUBLISHED" },
                select: { id: true, title: true, playCount: true },
                orderBy: { playCount: 'desc' },
                take: 10
            })
        ]);
        return {
            totalPodcasts,
            totalAudiobooks,
            totalArchives,
            totalPlays: 0, // Would need to aggregate from playback progress
            topContent: [...topPodcasts, ...topAudiobooks].sort((a, b) => b.playCount - a.playCount).slice(0, 10)
        };
    }
    async getUserAnalytics(query) {
        const { startDate, endDate } = query;
        const dateFilter = this.getDateFilter(startDate, endDate);
        const [totalUsers, activeUsers, newUsers] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.user.count({ where: { isActive: true } }),
            prisma_1.prisma.user.count({ where: dateFilter })
        ]);
        // Get user growth over time (simplified)
        const userGrowth = await prisma_1.prisma.user.groupBy({
            by: ['createdAt'],
            _count: { id: true },
            orderBy: { createdAt: 'asc' }
        });
        return {
            totalUsers,
            activeUsers,
            newUsers,
            userGrowth: userGrowth.slice(-30) // Last 30 data points
        };
    }
    async getLiveAnalytics(query) {
        const { startDate, endDate } = query;
        const dateFilter = this.getDateFilter(startDate, endDate);
        const [totalBroadcasts, broadcastStats] = await Promise.all([
            prisma_1.prisma.liveBroadcast.count({ where: dateFilter }),
            prisma_1.prisma.liveBroadcast.findMany({
                where: dateFilter,
                select: {
                    id: true,
                    title: true,
                    startTime: true,
                    endTime: true,
                    status: true
                },
                orderBy: { startTime: 'desc' },
                take: 20
            })
        ]);
        return {
            totalBroadcasts,
            averageListeners: 0, // Would need listener analytics data
            peakListeners: 0,
            broadcastStats
        };
    }
    async getDashboardStats() {
        const [totalUsers, totalStaff, totalPodcasts, totalAudiobooks, totalBroadcasts, recentActivity] = await Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.staff.count({ where: { isActive: true } }),
            prisma_1.prisma.podcast.count({ where: { status: "PUBLISHED" } }),
            prisma_1.prisma.audiobook.count({ where: { status: "PUBLISHED" } }),
            prisma_1.prisma.liveBroadcast.count(),
            this.getRecentActivity()
        ]);
        return {
            overview: {
                totalUsers,
                totalStaff,
                totalPodcasts,
                totalAudiobooks,
                totalBroadcasts
            },
            recentActivity
        };
    }
    async getRecentActivity() {
        const [recentComments, recentReviews, recentFavorites] = await Promise.all([
            prisma_1.prisma.comment.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } }
                }
            }),
            prisma_1.prisma.review.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } }
                }
            }),
            prisma_1.prisma.favorite.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true } }
                }
            })
        ]);
        return {
            recentComments,
            recentReviews,
            recentFavorites
        };
    }
    getDateFilter(startDate, endDate) {
        const filter = {};
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate)
                filter.createdAt.gte = new Date(startDate);
            if (endDate)
                filter.createdAt.lte = new Date(endDate);
        }
        return filter;
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=analytics.service.js.map