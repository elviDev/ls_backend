import { AudiobookDto, ChapterDto, AudiobookQueryDto } from "../dto/audiobook.dto";
export declare class AudiobookService {
    getAudiobooks(query: AudiobookQueryDto): Promise<{
        audiobooks: ({
            genre: {
                name: string;
                id: string;
            };
            createdBy: {
                id: string;
                profileImage: string;
                firstName: string;
                lastName: string;
            };
            _count: {
                favorites: number;
                reviews: number;
                chapters: number;
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
        })[];
        count: number;
    }>;
    getAudiobookById(id: string): Promise<{
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
        _count: {
            favorites: number;
            reviews: number;
            chapters: number;
        };
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
    createChapter(audiobookId: string, chapterData: ChapterDto, userId: string): Promise<{
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
    toggleFavorite(audiobookId: string, userId: string): Promise<{
        message: string;
        isFavorited: boolean;
    }>;
}
//# sourceMappingURL=audiobook.service.d.ts.map