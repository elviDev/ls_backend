import { StaffDto, StaffUpdateDto, StaffQueryDto } from "../dto/staff.dto";
export declare class StaffService {
    getStaff(query: StaffQueryDto, requestingUserRole: string): Promise<{
        staff: {
            name: string;
            contentCount: number;
            joinedAt: string;
            lastActive: string;
            id: string;
            email: string;
            username: string;
            bio: string;
            profileImage: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            position: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.StaffRole;
            department: string;
            phone: string;
            isApproved: boolean;
            approvedAt: Date;
            startDate: Date;
            endDate: Date;
            _count: {
                audiobooks: number;
                hostedBroadcasts: number;
                podcasts: number;
            };
        }[];
        stats: {
            total: number;
            active: number;
            inactive: number;
            recentHires: number;
            byRole: Record<string, number>;
            byDepartment: Record<string, number>;
        };
        pagination: {
            page: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
        pendingCount: number;
    }>;
    getStaffById(id: string, requestingUserId: string, requestingUserRole: string): Promise<{
        id: string;
        email: string;
        username: string;
        bio: string;
        profileImage: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        position: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.StaffRole;
        department: string;
        phone: string;
        address: string;
        emergencyContact: string;
        isApproved: boolean;
        approvedAt: Date;
        startDate: Date;
        endDate: Date;
        salary: number;
        _count: {
            audiobooks: number;
            hostedBroadcasts: number;
            podcasts: number;
        };
    }>;
    createStaff(staffData: StaffDto, requestingUserRole: string): Promise<{
        id: string;
        email: string;
        username: string;
        bio: string;
        profileImage: string;
        isActive: boolean;
        createdAt: Date;
        position: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.StaffRole;
        department: string;
        phone: string;
        isApproved: boolean;
        startDate: Date;
    }>;
    updateStaff(id: string, staffData: StaffUpdateDto, requestingUserId: string, requestingUserRole: string): Promise<{
        id: string;
        email: string;
        username: string;
        bio: string;
        profileImage: string;
        isActive: boolean;
        updatedAt: Date;
        position: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.StaffRole;
        department: string;
        phone: string;
        isApproved: boolean;
        startDate: Date;
    }>;
    approveStaff(id: string, requestingUserRole: string, requestingUserId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isApproved: boolean;
        approvedAt: Date;
    }>;
    deactivateStaff(id: string, requestingUserRole: string): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        firstName: string;
        lastName: string;
        endDate: Date;
    }>;
}
//# sourceMappingURL=staff.service.d.ts.map