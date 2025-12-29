import { PodcastDto, PodcastEpisodeDto, PodcastQueryDto } from "../dto/podcast.dto";
export declare class PodcastService {
    getPodcasts(query: PodcastQueryDto): Promise<{
        podcasts: {
            id: any;
            title: any;
            slug: any;
            description: any;
            category: any;
            image: any;
            status: any;
            host: {
                name: any;
                author: {
                    id: any;
                    name: string;
                    profileImage: any;
                };
            };
            genre: any;
            stats: {
                episodes: any;
                favorites: any;
            };
            latestEpisode: {
                id: string;
                title: string;
                duration: number;
                publishedAt: Date;
            };
            createdAt: any;
            updatedAt: any;
        }[];
        count: number;
    }>;
    getPodcastById(id: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        author: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
        _count: {
            favorites: number;
            episodes: number;
        };
        episodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            podcastId: string;
            status: import(".prisma/client").$Enums.EpisodeStatus;
            description: string | null;
            title: string;
            duration: number;
            publishedAt: Date | null;
            audioFile: string;
            transcript: string | null;
            transcriptFile: string | null;
            episodeNumber: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PodcastStatus;
        description: string;
        tags: string | null;
        title: string;
        coverImage: string | null;
        duration: number | null;
        releaseDate: Date;
        genreId: string;
        host: string;
        guests: string | null;
        audioFile: string | null;
        authorId: string;
    }>;
    createPodcast(podcastData: PodcastDto, authorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PodcastStatus;
        description: string;
        tags: string | null;
        title: string;
        coverImage: string | null;
        duration: number | null;
        releaseDate: Date;
        genreId: string;
        host: string;
        guests: string | null;
        audioFile: string | null;
        authorId: string;
    }>;
    updatePodcast(id: string, podcastData: Partial<PodcastDto>, userId: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        author: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PodcastStatus;
        description: string;
        tags: string | null;
        title: string;
        coverImage: string | null;
        duration: number | null;
        releaseDate: Date;
        genreId: string;
        host: string;
        guests: string | null;
        audioFile: string | null;
        authorId: string;
    }>;
    deletePodcast(id: string, userId: string): Promise<{
        message: string;
    }>;
    getEpisodes(podcastId: string): Promise<{
        episodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            podcastId: string;
            status: import(".prisma/client").$Enums.EpisodeStatus;
            description: string | null;
            title: string;
            duration: number;
            publishedAt: Date | null;
            audioFile: string;
            transcript: string | null;
            transcriptFile: string | null;
            episodeNumber: number;
        }[];
    }>;
    getEpisodeById(episodeId: string): Promise<{
        podcast: {
            id: string;
            title: string;
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        podcastId: string;
        status: import(".prisma/client").$Enums.EpisodeStatus;
        description: string | null;
        title: string;
        duration: number;
        publishedAt: Date | null;
        audioFile: string;
        transcript: string | null;
        transcriptFile: string | null;
        episodeNumber: number;
    }>;
    createEpisode(podcastId: string, episodeData: PodcastEpisodeDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        podcastId: string;
        status: import(".prisma/client").$Enums.EpisodeStatus;
        description: string | null;
        title: string;
        duration: number;
        publishedAt: Date | null;
        audioFile: string;
        transcript: string | null;
        transcriptFile: string | null;
        episodeNumber: number;
    }>;
    updateEpisode(episodeId: string, episodeData: Partial<PodcastEpisodeDto>, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        podcastId: string;
        status: import(".prisma/client").$Enums.EpisodeStatus;
        description: string | null;
        title: string;
        duration: number;
        publishedAt: Date | null;
        audioFile: string;
        transcript: string | null;
        transcriptFile: string | null;
        episodeNumber: number;
    }>;
    deleteEpisode(episodeId: string, userId: string): Promise<{
        message: string;
    }>;
    toggleFavorite(podcastId: string, userId: string): Promise<{
        message: string;
        isFavorited: boolean;
    }>;
}
//# sourceMappingURL=podcast.service.d.ts.map