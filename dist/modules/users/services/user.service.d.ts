import { UserDto, ChangePasswordDto } from "../dto/user.dto";
export declare class UserService {
    getUserProfile(userId: string): Promise<{
        name: string;
        id: string;
        email: string;
        username: string;
        profileImage: string;
        createdAt: Date;
        _count: {
            favorites: number;
            reviews: number;
        };
    }>;
    updateProfile(userId: string, userData: UserDto): Promise<{
        name: string;
        id: string;
        email: string;
        username: string;
        profileImage: string;
        createdAt: Date;
    }>;
    changePassword(userId: string, passwordData: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getFavorites(userId: string): Promise<({
        audiobook: {
            id: string;
            description: string;
            title: string;
            coverImage: string;
            author: string;
        };
        podcast: {
            id: string;
            description: string;
            title: string;
            coverImage: string;
            author: {
                firstName: string;
                lastName: string;
            };
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string | null;
        audiobookId: string | null;
        podcastId: string | null;
        archiveId: string | null;
        podcastEpisodeId: string | null;
        staffId: string | null;
    })[]>;
    getPublicProfile(userId: string): Promise<{
        name: string;
        id: string;
        username: string;
        profileImage: string;
        createdAt: Date;
        _count: {
            favorites: number;
            reviews: number;
        };
    }>;
    getUsers(query: any, requestingUserRole: string): Promise<{
        users: {
            activityCount: number;
            joinedAt: string;
            lastActive: string;
            name: string;
            id: string;
            email: string;
            username: string;
            profileImage: string;
            emailVerified: boolean;
            isActive: boolean;
            isSuspended: boolean;
            suspendedAt: Date;
            suspendedReason: string;
            lastLoginAt: Date;
            createdAt: Date;
            updatedAt: Date;
            _count: {
                favorites: number;
                comments: number;
                playlists: number;
            };
        }[];
        stats: {
            total: number;
            active: number;
            suspended: number;
            verified: number;
            newUsers: number;
            activeLastMonth: number;
            unverified: number;
        };
        pagination: {
            page: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUserStatus(id: string, data: any): Promise<{
        name: string;
        id: string;
        email: string;
        isActive: boolean;
        isSuspended: boolean;
        suspendedAt: Date;
        suspendedReason: string;
    }>;
    deleteUser(id: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map