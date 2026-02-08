import { AnalyticsQueryDto } from "../dto/analytics.dto";
export declare class AnalyticsService {
    getContentAnalytics(query: AnalyticsQueryDto): Promise<{
        totalPodcasts: number;
        totalAudiobooks: number;
        totalArchives: number;
        totalPlays: number;
        topContent: ({
            id: string;
            createdAt: Date;
            title: string;
        } | {
            id: string;
            playCount: number;
            title: string;
        })[];
    }>;
    getUserAnalytics(query: AnalyticsQueryDto): Promise<{
        totalUsers: number;
        activeUsers: number;
        newUsers: number;
        userGrowth: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.UserGroupByOutputType, "createdAt"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    getLiveAnalytics(query: AnalyticsQueryDto): Promise<{
        totalBroadcasts: number;
        averageListeners: number;
        peakListeners: number;
        broadcastStats: {
            id: string;
            status: import(".prisma/client").$Enums.BroadcastStatus;
            title: string;
            startTime: Date;
            endTime: Date;
        }[];
    }>;
    getDashboardStats(): Promise<{
        overview: {
            totalUsers: number;
            totalStaff: number;
            totalPodcasts: number;
            totalAudiobooks: number;
            totalBroadcasts: number;
        };
        recentActivity: {
            recentComments: ({
                user: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                audiobookId: string | null;
                podcastId: string | null;
                archiveId: string | null;
                content: string;
                podcastEpisodeId: string | null;
                liveBroadcastId: string | null;
                parentId: string | null;
            })[];
            recentReviews: ({
                user: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                audiobookId: string | null;
                podcastId: string | null;
                archiveId: string | null;
                comment: string | null;
                rating: number;
            })[];
            recentFavorites: ({
                user: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                userId: string | null;
                audiobookId: string | null;
                podcastId: string | null;
                archiveId: string | null;
                podcastEpisodeId: string | null;
                staffId: string | null;
            })[];
        };
    }>;
    getPodcastAnalytics(query: AnalyticsQueryDto): Promise<{
        totalPodcasts: number;
        publishedPodcasts: number;
        topPodcasts: {
            id: string;
            createdAt: Date;
            title: string;
        }[];
        podcastsByGenre: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PodcastGroupByOutputType, "genreId"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    private getRecentActivity;
    private getDateFilter;
}
//# sourceMappingURL=analytics.service.d.ts.map