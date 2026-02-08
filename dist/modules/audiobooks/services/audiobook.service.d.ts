import { AudiobookDto, ChapterDto, AudiobookQueryDto } from "../dto/audiobook.dto";
export declare class AudiobookService {
    getAudiobooks(query: AudiobookQueryDto, userId?: string): Promise<{
        audiobooks: {
            duration: number;
            isFavorited: boolean;
            recentReviews: {
                user: {
                    name: string;
                };
                id: string;
                createdAt: Date;
                comment: string;
                rating: number;
            }[];
            recentComments: {
                user: {
                    name: string;
                };
                id: string;
                createdAt: Date;
                content: string;
            }[];
            chapters: any;
            favorites: any;
            reviews: any;
            comments: any;
            genre: {
                name: string;
                id: string;
            };
            createdBy: {
                id: string;
                bio: string;
                profileImage: string;
                firstName: string;
                lastName: string;
            };
            _count: {
                favorites: number;
                bookmarks: number;
                comments: number;
                reviews: number;
                chapters: number;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AudiobookStatus;
            currency: string;
            playCount: number;
            description: string;
            tags: string | null;
            title: string;
            slug: string;
            narrator: string;
            coverImage: string;
            releaseDate: Date;
            likeCount: number;
            isbn: string | null;
            publisher: string | null;
            language: string;
            price: number | null;
            isExclusive: boolean;
            publishedAt: Date | null;
            archivedAt: Date | null;
            genreId: string;
            author: string | null;
            createdById: string;
        }[];
        count: number;
    }>;
    getAudiobookById(id: string, userId?: string): Promise<{
        isFavorited: boolean;
        isBookmarked: boolean;
        userBookmarks: {
            id: string;
            createdAt: Date;
            userId: string;
            audiobookId: string | null;
            podcastId: string | null;
            archiveId: string | null;
            position: number;
        }[];
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
        }[];
        recentReviews: {
            user: {
                name: string;
            };
            id: string;
            createdAt: Date;
            comment: string;
            rating: number;
        }[];
        recentComments: {
            user: {
                name: string;
            };
            id: string;
            createdAt: Date;
            content: string;
        }[];
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        createdBy: {
            id: string;
            bio: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
        favorites: {
            id: string;
            createdAt: Date;
            userId: string | null;
            audiobookId: string | null;
            podcastId: string | null;
            archiveId: string | null;
            podcastEpisodeId: string | null;
            staffId: string | null;
        }[];
        _count: {
            favorites: number;
            bookmarks: number;
            comments: number;
            reviews: number;
            chapters: number;
        };
        bookmarks: {
            id: string;
            createdAt: Date;
            userId: string;
            audiobookId: string | null;
            podcastId: string | null;
            archiveId: string | null;
            position: number;
        }[];
        comments: {
            user: {
                name: string;
            };
            id: string;
            createdAt: Date;
            content: string;
        }[];
        reviews: {
            user: {
                name: string;
            };
            id: string;
            createdAt: Date;
            comment: string;
            rating: number;
        }[];
        chapters: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            audiobookId: string;
            status: import(".prisma/client").$Enums.ChapterStatus;
            playCount: number;
            description: string | null;
            title: string;
            duration: number;
            audioFile: string;
            transcript: string | null;
            trackNumber: number;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AudiobookStatus;
        currency: string;
        playCount: number;
        description: string;
        tags: string | null;
        title: string;
        slug: string;
        narrator: string;
        coverImage: string;
        duration: number;
        releaseDate: Date;
        likeCount: number;
        isbn: string | null;
        publisher: string | null;
        language: string;
        price: number | null;
        isExclusive: boolean;
        publishedAt: Date | null;
        archivedAt: Date | null;
        genreId: string;
        author: string | null;
        createdById: string;
    }>;
    createAudiobook(audiobookData: AudiobookDto, createdById: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        createdBy: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AudiobookStatus;
        currency: string;
        playCount: number;
        description: string;
        tags: string | null;
        title: string;
        slug: string;
        narrator: string;
        coverImage: string;
        duration: number;
        releaseDate: Date;
        likeCount: number;
        isbn: string | null;
        publisher: string | null;
        language: string;
        price: number | null;
        isExclusive: boolean;
        publishedAt: Date | null;
        archivedAt: Date | null;
        genreId: string;
        author: string | null;
        createdById: string;
    }>;
    updateAudiobook(id: string, audiobookData: Partial<AudiobookDto>, userId: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        createdBy: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AudiobookStatus;
        currency: string;
        playCount: number;
        description: string;
        tags: string | null;
        title: string;
        slug: string;
        narrator: string;
        coverImage: string;
        duration: number;
        releaseDate: Date;
        likeCount: number;
        isbn: string | null;
        publisher: string | null;
        language: string;
        price: number | null;
        isExclusive: boolean;
        publishedAt: Date | null;
        archivedAt: Date | null;
        genreId: string;
        author: string | null;
        createdById: string;
    }>;
    deleteAudiobook(id: string, userId: string): Promise<{
        message: string;
    }>;
    getChapters(audiobookId: string): Promise<{
        chapters: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            audiobookId: string;
            status: import(".prisma/client").$Enums.ChapterStatus;
            playCount: number;
            description: string | null;
            title: string;
            duration: number;
            audioFile: string;
            transcript: string | null;
            trackNumber: number;
        }[];
    }>;
    getChapter(audiobookId: string, chapterId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        audiobookId: string;
        status: import(".prisma/client").$Enums.ChapterStatus;
        playCount: number;
        description: string | null;
        title: string;
        duration: number;
        audioFile: string;
        transcript: string | null;
        trackNumber: number;
    }>;
    createChapter(audiobookId: string, chapterData: ChapterDto, userId: string, audioFile: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        audiobookId: string;
        status: import(".prisma/client").$Enums.ChapterStatus;
        playCount: number;
        description: string | null;
        title: string;
        duration: number;
        audioFile: string;
        transcript: string | null;
        trackNumber: number;
    }>;
    getAudiobookStats(): Promise<{
        total: number;
        published: number;
        draft: number;
        archived: number;
        totalChapters: number;
        totalDuration: number;
        totalPlays: number;
        averageRating: number;
        topGenres: {
            name: string;
            count: number;
        }[];
    }>;
    toggleFavorite(audiobookId: string, userId: string): Promise<{
        message: string;
        isFavorited: boolean;
    }>;
    saveProgress(audiobookId: string, userId: string, position: number, chapterId?: string): Promise<{
        message: string;
        data: {
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
    }>;
    getProgress(audiobookId: string, userId: string): Promise<{
        data: {
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
    }>;
    updateChapter(audiobookId: string, chapterId: string, chapterData: Partial<ChapterDto>, userId: string, audioFile?: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        audiobookId: string;
        status: import(".prisma/client").$Enums.ChapterStatus;
        playCount: number;
        description: string | null;
        title: string;
        duration: number;
        audioFile: string;
        transcript: string | null;
        trackNumber: number;
    }>;
    deleteChapter(audiobookId: string, chapterId: string, userId: string): Promise<{
        message: string;
    }>;
    private updateAudiobookDuration;
    toggleBookmark(audiobookId: string, userId: string): Promise<{
        message: string;
        bookmarked: boolean;
    }>;
}
//# sourceMappingURL=audiobook.service.d.ts.map