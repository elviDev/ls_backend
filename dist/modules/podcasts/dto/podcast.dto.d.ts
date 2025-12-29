export interface PodcastDto {
    title: string;
    slug: string;
    description: string;
    category: string;
    image?: string;
    host: string;
    genreId?: string;
}
export interface PodcastEpisodeDto {
    title: string;
    description: string;
    audioUrl: string;
    duration?: number;
    episodeNumber?: number;
    seasonNumber?: number;
}
export interface PodcastQueryDto {
    featured?: boolean;
    limit?: number;
    category?: string;
    genreId?: string;
}
//# sourceMappingURL=podcast.dto.d.ts.map