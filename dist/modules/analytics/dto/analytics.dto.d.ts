export interface AnalyticsQueryDto {
    startDate?: string;
    endDate?: string;
    type?: 'content' | 'users' | 'live';
}
export interface ContentAnalyticsDto {
    totalPodcasts: number;
    totalAudiobooks: number;
    totalArchives: number;
    totalPlays: number;
    topContent: any[];
}
export interface UserAnalyticsDto {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: any[];
}
export interface LiveAnalyticsDto {
    totalBroadcasts: number;
    averageListeners: number;
    peakListeners: number;
    broadcastStats: any[];
}
//# sourceMappingURL=analytics.dto.d.ts.map