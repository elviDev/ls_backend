"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const prisma_1 = require("../../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class StaffService {
    async getStaff(query, requestingUserRole) {
        console.log("Request User Role: ", requestingUserRole);
        // All staff members can view staff list
        if (![
            "ADMIN",
            "HOST",
            "CO_HOST",
            "PRODUCER",
            "SOUND_ENGINEER",
            "CONTENT_MANAGER",
            "TECHNICAL_SUPPORT",
        ].includes(requestingUserRole)) {
            throw {
                statusCode: 403,
                message: "Only staff members can view staff list",
            };
        }
        const { role, department, search, isActive, isApproved, sortBy = "createdAt", sortOrder = "desc", page = 1, perPage = 10, } = query;
        const where = {};
        console.log('Query filters:', { role, department, search, isActive, isApproved });
        // Debug: First check if there are any staff at all
        const totalStaffCount = await prisma_1.prisma.staff.count();
        console.log(`Total staff in database: ${totalStaffCount}`);
        if (role && role !== "all") {
            const roles = role.split(",").map((r) => r.trim());
            where.role = roles.length === 1 ? roles[0] : { in: roles };
        }
        if (department && department !== "all") {
            where.department = { contains: department, mode: "insensitive" };
        }
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { username: { contains: search, mode: "insensitive" } },
            ];
        }
        if (isActive !== undefined && isActive !== "all" && isActive !== false) {
            where.isActive = isActive === "true" || isActive === true;
            console.log(`Filtering by isActive: ${isActive} -> ${isActive === "true" || isActive === true}`);
        }
        if (isApproved !== undefined && isApproved !== "all" && isApproved !== false) {
            where.isApproved = isApproved === "true" || isApproved === true;
            console.log(`Filtering by isApproved: ${isApproved} -> ${isApproved === "true" || isApproved === true}`);
        }
        console.log('Final where clause:', JSON.stringify(where, null, 2));
        const [staff, total] = await Promise.all([
            prisma_1.prisma.staff.findMany({
                where,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    email: true,
                    role: true,
                    department: true,
                    position: true,
                    phone: true,
                    profileImage: true,
                    isActive: true,
                    isApproved: true,
                    approvedAt: true,
                    startDate: true,
                    endDate: true,
                    bio: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            podcasts: true,
                            audiobooks: true,
                            hostedBroadcasts: true,
                        },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            prisma_1.prisma.staff.count({ where }),
        ]);
        console.log(`Found ${staff.length} staff members, total: ${total}`);
        // Calculate stats
        const allStaff = await prisma_1.prisma.staff.findMany({
            select: {
                isActive: true,
                role: true,
                department: true,
                createdAt: true,
            },
        });
        const stats = {
            total: allStaff.length,
            active: allStaff.filter(s => s.isActive).length,
            inactive: allStaff.filter(s => !s.isActive).length,
            recentHires: allStaff.filter(s => {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return s.createdAt >= thirtyDaysAgo;
            }).length,
            byRole: allStaff.reduce((acc, s) => {
                acc[s.role] = (acc[s.role] || 0) + 1;
                return acc;
            }, {}),
            byDepartment: allStaff.reduce((acc, s) => {
                const dept = s.department || 'Unknown';
                acc[dept] = (acc[dept] || 0) + 1;
                return acc;
            }, {}),
        };
        // Get pending count for admins
        const pendingCount = requestingUserRole === 'ADMIN'
            ? await prisma_1.prisma.staff.count({ where: { isApproved: false } })
            : 0;
        return {
            staff: staff.map((member) => ({
                ...member,
                name: `${member.firstName} ${member.lastName}`,
                contentCount: member._count.podcasts +
                    member._count.audiobooks +
                    member._count.hostedBroadcasts,
                joinedAt: member.createdAt.toISOString(),
                lastActive: member.updatedAt.toISOString(),
            })),
            stats,
            pagination: {
                page,
                perPage,
                total,
                totalPages: Math.ceil(total / perPage),
            },
            pendingCount,
        };
    }
    async getStaffById(id, requestingUserId, requestingUserRole) {
        // Users can view their own profile, ADMIN can view any
        if (id !== requestingUserId && requestingUserRole !== "ADMIN") {
            throw {
                statusCode: 403,
                message: "Not authorized to view this staff member",
            };
        }
        const staff = await prisma_1.prisma.staff.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                role: true,
                department: true,
                position: true,
                phone: true,
                address: true,
                emergencyContact: true,
                profileImage: true,
                isActive: true,
                isApproved: true,
                approvedAt: true,
                startDate: true,
                endDate: true,
                salary: requestingUserRole === "ADMIN" || id === requestingUserId, // Only show salary to admin or self
                bio: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        podcasts: true,
                        audiobooks: true,
                        hostedBroadcasts: true,
                    },
                },
            },
        });
        if (!staff) {
            throw { statusCode: 404, message: "Staff member not found" };
        }
        return staff;
    }
    async createStaff(staffData, requestingUserRole) {
        // Only ADMIN can create staff
        if (requestingUserRole !== "ADMIN") {
            throw {
                statusCode: 403,
                message: "Only administrators can create staff members",
            };
        }
        // Check if username or email already exists
        const existingStaff = await prisma_1.prisma.staff.findFirst({
            where: {
                OR: [{ username: staffData.username }, { email: staffData.email }],
            },
        });
        if (existingStaff) {
            throw { statusCode: 400, message: "Username or email already exists" };
        }
        const hashedPassword = await bcryptjs_1.default.hash(staffData.password, 12);
        const staff = await prisma_1.prisma.staff.create({
            data: {
                ...staffData,
                role: staffData.role, // Cast to StaffRole enum
                password: hashedPassword,
                emailVerified: false,
                isActive: true,
                isApproved: true, // Auto-approve when created by admin
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                role: true,
                department: true,
                position: true,
                phone: true,
                profileImage: true,
                isActive: true,
                isApproved: true,
                startDate: true,
                bio: true,
                createdAt: true,
            },
        });
        return staff;
    }
    async updateStaff(id, staffData, requestingUserId, requestingUserRole) {
        // Users can update their own profile (limited fields), ADMIN can update any
        if (id !== requestingUserId && requestingUserRole !== "ADMIN") {
            throw {
                statusCode: 403,
                message: "Not authorized to update this staff member",
            };
        }
        // Restrict fields for non-admin users
        if (requestingUserRole !== "ADMIN" && id === requestingUserId) {
            const allowedFields = [
                "firstName",
                "lastName",
                "phone",
                "address",
                "emergencyContact",
                "bio",
            ];
            const filteredData = {};
            allowedFields.forEach((field) => {
                if (staffData[field] !== undefined) {
                    filteredData[field] = staffData[field];
                }
            });
            staffData = filteredData;
        }
        const staff = await prisma_1.prisma.staff.update({
            where: { id },
            data: {
                ...staffData,
                role: staffData.role ? staffData.role : undefined, // Cast role to StaffRole enum if present
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
                role: true,
                department: true,
                position: true,
                phone: true,
                profileImage: true,
                isActive: true,
                isApproved: true,
                startDate: true,
                bio: true,
                updatedAt: true,
            },
        });
        return staff;
    }
    async approveStaff(id, requestingUserRole, requestingUserId) {
        // Only ADMIN can approve staff
        if (requestingUserRole !== "ADMIN") {
            throw {
                statusCode: 403,
                message: "Only administrators can approve staff members",
            };
        }
        const staff = await prisma_1.prisma.staff.update({
            where: { id },
            data: {
                isApproved: true,
                approvedAt: new Date(),
                approvedBy: requestingUserId,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isApproved: true,
                approvedAt: true,
            },
        });
        return staff;
    }
    async deactivateStaff(id, requestingUserRole) {
        // Only ADMIN can deactivate staff
        if (requestingUserRole !== "ADMIN") {
            throw {
                statusCode: 403,
                message: "Only administrators can deactivate staff members",
            };
        }
        const staff = await prisma_1.prisma.staff.update({
            where: { id },
            data: {
                isActive: false,
                endDate: new Date(),
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                isActive: true,
                endDate: true,
            },
        });
        return staff;
    }
}
exports.StaffService = StaffService;
//# sourceMappingURL=staff.service.js.map