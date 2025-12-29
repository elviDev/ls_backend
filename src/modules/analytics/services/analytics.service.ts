import { prisma } from "../../../lib/prisma";
import { AnalyticsQueryDto } from "../dto/analytics.dto";

export class AnalyticsService {
  async getContentAnalytics(query: AnalyticsQueryDto) {
    const { startDate, endDate } = query;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const [totalPodcasts, totalAudiobooks, totalArchives, topPodcasts, topAudiobooks] = await Promise.all([
      prisma.podcast.count({ where: { status: "PUBLISHED", ...dateFilter } }),
      prisma.audiobook.count({ where: { status: "PUBLISHED", ...dateFilter } }),
      prisma.archive.count({ where: { status: "ACTIVE", ...dateFilter } }),
      prisma.podcast.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.audiobook.findMany({
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
      topContent: [...topPodcasts, ...topAudiobooks].slice(0, 10)
    };
  }

  async getUserAnalytics(query: AnalyticsQueryDto) {
    const { startDate, endDate } = query;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const [totalUsers, activeUsers, newUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: dateFilter })
    ]);

    // Get user growth over time (simplified)
    const userGrowth = await prisma.user.groupBy({
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

  async getLiveAnalytics(query: AnalyticsQueryDto) {
    const { startDate, endDate } = query;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const [totalBroadcasts, broadcastStats] = await Promise.all([
      prisma.liveBroadcast.count({ where: dateFilter }),
      prisma.liveBroadcast.findMany({
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
    const [
      totalUsers,
      totalStaff,
      totalPodcasts,
      totalAudiobooks,
      totalBroadcasts,
      recentActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.staff.count({ where: { isActive: true } }),
      prisma.podcast.count({ where: { status: "PUBLISHED" } }),
      prisma.audiobook.count({ where: { status: "PUBLISHED" } }),
      prisma.liveBroadcast.count(),
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

  async getPodcastAnalytics(query: AnalyticsQueryDto) {
    const { startDate, endDate } = query;
    const dateFilter = this.getDateFilter(startDate, endDate);

    const [totalPodcasts, publishedPodcasts, topPodcasts, podcastsByGenre] = await Promise.all([
      prisma.podcast.count({ where: dateFilter }),
      prisma.podcast.count({ where: { status: "PUBLISHED", ...dateFilter } }),
      prisma.podcast.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.podcast.groupBy({
        by: ['genreId'],
        _count: { id: true },
        where: { status: "PUBLISHED" }
      })
    ]);

    return {
      totalPodcasts,
      publishedPodcasts,
      topPodcasts,
      podcastsByGenre
    };
  }

  private async getRecentActivity() {
    const [recentComments, recentReviews, recentFavorites] = await Promise.all([
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } }
        }
      }),
      prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } }
        }
      }),
      prisma.favorite.findMany({
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

  private getDateFilter(startDate?: string, endDate?: string) {
    const filter: any = {};
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.gte = new Date(startDate);
      if (endDate) filter.createdAt.lte = new Date(endDate);
    }

    return filter;
  }
}