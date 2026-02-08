import { BroadcastDto, BroadcastQueryDto } from "../dto/broadcast.dto";
export declare class BroadcastService {
    constructor();
    getBroadcasts(query: BroadcastQueryDto): Promise<({
        program: {
            id: string;
            title: string;
            slug: string;
            image: string;
        };
        banner: {
            id: string;
            url: string;
        };
        hostUser: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
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
    })[]>;
    getCurrentBroadcast(): Promise<{
        program: {
            id: string;
            description: string;
            title: string;
            slug: string;
            image: string;
        };
        hostUser: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
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
    }>;
    getUpcomingBroadcasts(limit?: number): Promise<({
        program: {
            id: string;
            title: string;
            slug: string;
            image: string;
        };
        hostUser: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
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
    })[]>;
    getBroadcastEvents(): Promise<{
        live: {
            program: {
                id: string;
                title: string;
                slug: string;
                image: string;
            };
            hostUser: {
                id: string;
                profileImage: string;
                firstName: string;
                lastName: string;
            };
        } & {
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
        upcoming: {
            program: {
                id: string;
                title: string;
                slug: string;
                image: string;
            };
            hostUser: {
                id: string;
                profileImage: string;
                firstName: string;
                lastName: string;
            };
        } & {
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
    }>;
    createBroadcast(broadcastData: BroadcastDto, createdById: string): Promise<{
        staff: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            joinedAt: Date;
            leftAt: Date | null;
            notes: string | null;
            role: import(".prisma/client").$Enums.BroadcastRole;
            broadcastId: string;
        })[];
        program: {
            id: string;
            title: string;
            slug: string;
            image: string;
        };
        guests: {
            name: string;
            id: string;
            createdAt: Date;
            role: string;
            title: string | null;
            broadcastId: string;
        }[];
        banner: {
            id: string;
            url: string;
        };
        hostUser: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
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
    }>;
    getBroadcastById(identifier: string): Promise<{
        staff: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            joinedAt: Date;
            leftAt: Date | null;
            notes: string | null;
            role: import(".prisma/client").$Enums.BroadcastRole;
            broadcastId: string;
        })[];
        program: {
            id: string;
            title: string;
            slug: string;
            image: string;
        };
        guests: {
            name: string;
            id: string;
            createdAt: Date;
            role: string;
            title: string | null;
            broadcastId: string;
        }[];
        banner: {
            id: string;
            url: string;
        };
        hostUser: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
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
    }>;
    deleteBroadcast(identifier: string, userId: string): Promise<{
        message: string;
    }>;
    updateBroadcast(identifier: string, broadcastData: Partial<BroadcastDto>, userId: string): Promise<{
        staff: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            joinedAt: Date;
            leftAt: Date | null;
            notes: string | null;
            role: import(".prisma/client").$Enums.BroadcastRole;
            broadcastId: string;
        })[];
        program: {
            id: string;
            title: string;
            slug: string;
            image: string;
        };
        guests: {
            name: string;
            id: string;
            createdAt: Date;
            role: string;
            title: string | null;
            broadcastId: string;
        }[];
        banner: {
            id: string;
            url: string;
        };
        hostUser: {
            id: string;
            profileImage: string;
            firstName: string;
            lastName: string;
        };
    } & {
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
    }>;
    startBroadcast(identifier: string, userId: string): Promise<{
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
    }>;
    endBroadcast(identifier: string, userId: string): Promise<{
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
    }>;
    private generateSlug;
}
//# sourceMappingURL=broadcast.service.d.ts.map