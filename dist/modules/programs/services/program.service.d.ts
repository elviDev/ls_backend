import { ProgramDto, ProgramEpisodeDto } from "../dto/program.dto";
export declare class ProgramService {
    getPrograms(): Promise<{
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
            firstName: string;
            lastName: string;
        };
        episodes: {
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
        }[];
        broadcasts: {
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
    updateProgram(id: string, programData: Partial<ProgramDto>, userId: string): Promise<{
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
    createEpisode(programId: string, episodeData: ProgramEpisodeDto, userId: string): Promise<{
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
}
//# sourceMappingURL=program.service.d.ts.map