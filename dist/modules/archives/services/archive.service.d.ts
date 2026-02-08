import { ArchiveDto, ArchiveQueryDto } from "../dto/archive.dto";
export declare class ArchiveService {
    getArchives(query: ArchiveQueryDto): Promise<{
        archives: ({
            createdBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
            _count: {
                favorites: number;
                comments: number;
                reviews: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            audiobookId: string | null;
            podcastId: string | null;
            status: import(".prisma/client").$Enums.ArchiveStatus;
            type: import(".prisma/client").$Enums.ArchiveType;
            playCount: number;
            description: string | null;
            tags: string | null;
            title: string;
            slug: string;
            coverImage: string | null;
            duration: number | null;
            likeCount: number;
            isExclusive: boolean;
            createdById: string;
            broadcastId: string | null;
            guests: string | null;
            category: string | null;
            audioFile: string | null;
            metadata: string | null;
            host: string | null;
            fileSize: number | null;
            downloadUrl: string | null;
            thumbnailImage: string | null;
            originalAirDate: Date | null;
            archivedDate: Date;
            downloadCount: number;
            shareCount: number;
            isFeatured: boolean;
            isDownloadable: boolean;
            accessLevel: string;
            transcript: string | null;
            transcriptFile: string | null;
            qualityVariants: string | null;
            episodeId: string | null;
            curatedById: string | null;
        })[];
        count: number;
    }>;
    getArchiveById(id: string): Promise<{
        audiobook: {
            id: string;
            title: string;
        };
        podcast: {
            id: string;
            title: string;
        };
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        _count: {
            favorites: number;
            comments: number;
            reviews: number;
        };
        broadcast: {
            id: string;
            title: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        audiobookId: string | null;
        podcastId: string | null;
        status: import(".prisma/client").$Enums.ArchiveStatus;
        type: import(".prisma/client").$Enums.ArchiveType;
        playCount: number;
        description: string | null;
        tags: string | null;
        title: string;
        slug: string;
        coverImage: string | null;
        duration: number | null;
        likeCount: number;
        isExclusive: boolean;
        createdById: string;
        broadcastId: string | null;
        guests: string | null;
        category: string | null;
        audioFile: string | null;
        metadata: string | null;
        host: string | null;
        fileSize: number | null;
        downloadUrl: string | null;
        thumbnailImage: string | null;
        originalAirDate: Date | null;
        archivedDate: Date;
        downloadCount: number;
        shareCount: number;
        isFeatured: boolean;
        isDownloadable: boolean;
        accessLevel: string;
        transcript: string | null;
        transcriptFile: string | null;
        qualityVariants: string | null;
        episodeId: string | null;
        curatedById: string | null;
    }>;
    createArchive(archiveData: ArchiveDto, createdById: string): Promise<{
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        audiobookId: string | null;
        podcastId: string | null;
        status: import(".prisma/client").$Enums.ArchiveStatus;
        type: import(".prisma/client").$Enums.ArchiveType;
        playCount: number;
        description: string | null;
        tags: string | null;
        title: string;
        slug: string;
        coverImage: string | null;
        duration: number | null;
        likeCount: number;
        isExclusive: boolean;
        createdById: string;
        broadcastId: string | null;
        guests: string | null;
        category: string | null;
        audioFile: string | null;
        metadata: string | null;
        host: string | null;
        fileSize: number | null;
        downloadUrl: string | null;
        thumbnailImage: string | null;
        originalAirDate: Date | null;
        archivedDate: Date;
        downloadCount: number;
        shareCount: number;
        isFeatured: boolean;
        isDownloadable: boolean;
        accessLevel: string;
        transcript: string | null;
        transcriptFile: string | null;
        qualityVariants: string | null;
        episodeId: string | null;
        curatedById: string | null;
    }>;
    updateArchive(id: string, archiveData: Partial<ArchiveDto>, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        audiobookId: string | null;
        podcastId: string | null;
        status: import(".prisma/client").$Enums.ArchiveStatus;
        type: import(".prisma/client").$Enums.ArchiveType;
        playCount: number;
        description: string | null;
        tags: string | null;
        title: string;
        slug: string;
        coverImage: string | null;
        duration: number | null;
        likeCount: number;
        isExclusive: boolean;
        createdById: string;
        broadcastId: string | null;
        guests: string | null;
        category: string | null;
        audioFile: string | null;
        metadata: string | null;
        host: string | null;
        fileSize: number | null;
        downloadUrl: string | null;
        thumbnailImage: string | null;
        originalAirDate: Date | null;
        archivedDate: Date;
        downloadCount: number;
        shareCount: number;
        isFeatured: boolean;
        isDownloadable: boolean;
        accessLevel: string;
        transcript: string | null;
        transcriptFile: string | null;
        qualityVariants: string | null;
        episodeId: string | null;
        curatedById: string | null;
    }>;
    deleteArchive(id: string, userId: string): Promise<{
        message: string;
    }>;
    toggleFavorite(archiveId: string, userId: string): Promise<{
        message: string;
        isFavorited: boolean;
    }>;
}
//# sourceMappingURL=archive.service.d.ts.map