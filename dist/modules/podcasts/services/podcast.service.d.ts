import { PodcastDto, PodcastEpisodeDto, PodcastQueryDto } from "../dto/podcast.dto";
export declare class PodcastService {
    getPodcasts(query: PodcastQueryDto, userId?: string): Promise<{
        podcasts: {
            id: any;
            title: any;
            slug: any;
            description: any;
            category: any;
            image: any;
            coverImage: any;
            status: any;
            author: any;
            genre: any;
            hostId: any;
            host: any;
            _count: any;
            isFavorited: boolean;
            recentReviews: any;
            recentComments: any;
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
    getPodcastById(id: string, userId?: string): Promise<any>;
    createPodcast(podcastData: PodcastDto, authorId: string): Promise<{
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
        host: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PodcastStatus;
        description: string;
        tags: string | null;
        title: string;
        slug: string;
        coverImage: string | null;
        duration: number | null;
        releaseDate: Date;
        genreId: string;
        hostId: string;
        guests: string | null;
        category: string | null;
        image: string | null;
        audioFile: string | null;
        authorId: string;
    }>;
    updatePodcast(id: string, podcastData: Partial<PodcastDto>, userId: string): Promise<{
        hostId: any;
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
        host: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PodcastStatus;
        description: string;
        tags: string | null;
        title: string;
        slug: string;
        coverImage: string | null;
        duration: number | null;
        releaseDate: Date;
        genreId: string;
        guests: string | null;
        category: string | null;
        image: string | null;
        audioFile: string | null;
        authorId: string;
    }>;
    deletePodcast(id: string, userId: string): Promise<{
        message: string;
    }>;
    getEpisodes(podcastId: string, userId?: string): Promise<{
        episodes: {
            isFavorited: boolean;
            playbackProgress: {
                id: string;
                updatedAt: Date;
                userId: string | null;
                audiobookId: string | null;
                podcastId: string | null;
                archiveId: string | null;
                position: number;
                podcastEpisodeId: string | null;
                liveBroadcastId: string | null;
                staffId: string | null;
                chapterId: string | null;
            };
            favorites: any;
            _count: {
                favorites: number;
                comments: number;
            };
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