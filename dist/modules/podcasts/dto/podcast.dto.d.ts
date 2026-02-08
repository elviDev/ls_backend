export interface PodcastDto {
    title: string;
    slug: string;
    description: string;
    category?: string;
    image?: string;
    coverImage?: string;
    host: string;
    genreId: string;
    releaseDate: string;
    tags?: string;
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
    dashboard?: boolean;
    status?: string;
}
//# sourceMappingURL=podcast.dto.d.ts.map