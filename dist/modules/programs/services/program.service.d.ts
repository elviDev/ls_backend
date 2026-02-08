import { ProgramDto, ProgramEpisodeDto, UpdateProgramEpisodeDto, ProgramQueryDto } from "../dto/program.dto";
export declare class ProgramService {
    getPrograms(query?: ProgramQueryDto): Promise<{
        programs: ({
            genre: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                slug: string;
                coverImage: string | null;
            };
            host: {
                id: string;
                bio: string;
                profileImage: string;
                firstName: string;
                lastName: string;
            };
            _count: {
                episodes: number;
                broadcasts: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ProgramStatus;
            schedule: string;
            description: string;
            title: string;
            slug: string;
            genreId: string | null;
            hostId: string;
            category: import(".prisma/client").$Enums.ProgramCategory;
            image: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getProgramById(id: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        host: {
            id: string;
            bio: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
        _count: {
            episodes: number;
            broadcasts: number;
        };
        episodes: ({
            broadcast: {
                id: string;
                status: import(".prisma/client").$Enums.BroadcastStatus;
                startTime: Date;
                endTime: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            duration: number | null;
            broadcastId: string | null;
            programId: string;
            audioFile: string | null;
            airDate: Date;
        })[];
        broadcasts: {
            id: string;
            status: import(".prisma/client").$Enums.BroadcastStatus;
            title: string;
            startTime: Date;
            endTime: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProgramStatus;
        schedule: string;
        description: string;
        title: string;
        slug: string;
        genreId: string | null;
        hostId: string;
        category: import(".prisma/client").$Enums.ProgramCategory;
        image: string | null;
    }>;
    getProgramBySlug(slug: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        host: {
            id: string;
            bio: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
        _count: {
            episodes: number;
            broadcasts: number;
        };
        episodes: ({
            broadcast: {
                id: string;
                status: import(".prisma/client").$Enums.BroadcastStatus;
                startTime: Date;
                endTime: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            duration: number | null;
            broadcastId: string | null;
            programId: string;
            audioFile: string | null;
            airDate: Date;
        })[];
        broadcasts: {
            id: string;
            status: import(".prisma/client").$Enums.BroadcastStatus;
            title: string;
            startTime: Date;
            endTime: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProgramStatus;
        schedule: string;
        description: string;
        title: string;
        slug: string;
        genreId: string | null;
        hostId: string;
        category: import(".prisma/client").$Enums.ProgramCategory;
        image: string | null;
    }>;
    createProgram(programData: ProgramDto, hostId: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        host: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProgramStatus;
        schedule: string;
        description: string;
        title: string;
        slug: string;
        genreId: string | null;
        hostId: string;
        category: import(".prisma/client").$Enums.ProgramCategory;
        image: string | null;
    }>;
    updateProgram(id: string, programData: Partial<ProgramDto>): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        host: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProgramStatus;
        schedule: string;
        description: string;
        title: string;
        slug: string;
        genreId: string | null;
        hostId: string;
        category: import(".prisma/client").$Enums.ProgramCategory;
        image: string | null;
    }>;
    deleteProgram(id: string, userId: string): Promise<{
        message: string;
    }>;
    getProgramEpisodes(programId: string, page?: number, limit?: number): Promise<{
        episodes: ({
            broadcast: {
                id: string;
                status: import(".prisma/client").$Enums.BroadcastStatus;
                startTime: Date;
                endTime: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            duration: number | null;
            broadcastId: string | null;
            programId: string;
            audioFile: string | null;
            airDate: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getEpisodeById(programId: string, episodeId: string): Promise<{
        program: {
            id: string;
            title: string;
            hostId: string;
        };
        broadcast: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BroadcastStatus;
            description: string;
            title: string;
            slug: string;
            streamUrl: string | null;
            startTime: Date;
            endTime: Date | null;
            hostId: string;
            bannerId: string | null;
            programId: string | null;
            recordingUrl: string | null;
            autoRecord: boolean;
            chatEnabled: boolean;
            chatModeration: boolean;
            allowGuests: boolean;
            maxListeners: number | null;
            quality: string;
            notificationsEnabled: boolean;
            emailNotifications: boolean;
            smsNotifications: boolean;
            slackNotifications: boolean;
            recordingFormat: string;
            streamDelay: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        duration: number | null;
        broadcastId: string | null;
        programId: string;
        audioFile: string | null;
        airDate: Date;
    }>;
    createEpisode(programId: string, episodeData: ProgramEpisodeDto, userId: string): Promise<{
        broadcast: {
            id: string;
            status: import(".prisma/client").$Enums.BroadcastStatus;
            startTime: Date;
            endTime: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        duration: number | null;
        broadcastId: string | null;
        programId: string;
        audioFile: string | null;
        airDate: Date;
    }>;
    updateEpisode(programId: string, episodeId: string, episodeData: UpdateProgramEpisodeDto, userId: string): Promise<{
        broadcast: {
            id: string;
            status: import(".prisma/client").$Enums.BroadcastStatus;
            startTime: Date;
            endTime: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        duration: number | null;
        broadcastId: string | null;
        programId: string;
        audioFile: string | null;
        airDate: Date;
    }>;
    deleteEpisode(programId: string, episodeId: string, userId: string): Promise<{
        message: string;
    }>;
    archiveProgram(id: string, userId: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        host: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProgramStatus;
        schedule: string;
        description: string;
        title: string;
        slug: string;
        genreId: string | null;
        hostId: string;
        category: import(".prisma/client").$Enums.ProgramCategory;
        image: string | null;
    }>;
    activateProgram(id: string, userId: string): Promise<{
        genre: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            coverImage: string | null;
        };
        host: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProgramStatus;
        schedule: string;
        description: string;
        title: string;
        slug: string;
        genreId: string | null;
        hostId: string;
        category: import(".prisma/client").$Enums.ProgramCategory;
        image: string | null;
    }>;
    getProgramAnalytics(programId: string, userId: string): Promise<{
        episodes: {
            total: number;
            totalDuration: number;
            averageDuration: number;
        };
        broadcasts: {
            total: number;
        };
        recentActivity: {
            id: string;
            title: string;
            duration: number;
            broadcast: {
                status: import(".prisma/client").$Enums.BroadcastStatus;
            };
            airDate: Date;
        }[];
    }>;
    linkEpisodeToBroadcast(programId: string, episodeId: string, broadcastId: string, userId: string): Promise<{
        broadcast: {
            id: string;
            status: import(".prisma/client").$Enums.BroadcastStatus;
            startTime: Date;
            endTime: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        duration: number | null;
        broadcastId: string | null;
        programId: string;
        audioFile: string | null;
        airDate: Date;
    }>;
    createSchedule(programId: string, scheduleData: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        audiobookId: string | null;
        podcastId: string | null;
        liveBroadcastId: string | null;
        status: import(".prisma/client").$Enums.ScheduleStatus;
        chapterId: string | null;
        type: import(".prisma/client").$Enums.ScheduleType;
        description: string | null;
        tags: string | null;
        title: string;
        duration: number | null;
        publishedAt: Date | null;
        startTime: Date;
        endTime: Date | null;
        timezone: string;
        isRecurring: boolean;
        recurringPattern: string | null;
        recurringEndDate: Date | null;
        priority: number;
        metadata: string | null;
        publishedBy: string | null;
        autoPublish: boolean;
        notifyStaff: boolean;
        notifyUsers: boolean;
        createdBy: string;
        assignedTo: string | null;
    }>;
}
//# sourceMappingURL=program.service.d.ts.map