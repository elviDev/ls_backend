import { prisma } from "../../../lib/prisma";
import { UserDto, ChangePasswordDto } from "../dto/user.dto";
import bcrypt from "bcryptjs";

export class UserService {
  // Individual user operations
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: {
            favorites: true,
            reviews: true
          }
        }
      }
    });

    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }

    return user;
  }

  async updateProfile(userId: string, userData: UserDto) {
    if (userData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: userData.username,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        throw { statusCode: 400, message: "Username already taken" };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        profileImage: true,
        createdAt: true
      }
    });

    return updatedUser;
  }

  async changePassword(userId: string, passwordData: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      throw { statusCode: 400, message: "New passwords don't match" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw { statusCode: 400, message: "Current password is incorrect" };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return { message: "Password changed successfully" };
  }

  async getFavorites(userId: string) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        podcast: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            author: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        audiobook: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            author: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return favorites;
  }

  async getPublicProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: {
            favorites: true,
            reviews: true
          }
        }
      }
    });

    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }

    return user;
  }

  // Admin operations on users
  async getUsers(query: any, requestingUserRole: string) {
    // All staff members can view users
    if (!['ADMIN', 'HOST', 'CO_HOST', 'PRODUCER', 'SOUND_ENGINEER', 'CONTENT_MANAGER', 'TECHNICAL_SUPPORT'].includes(requestingUserRole)) {
      throw { statusCode: 403, message: "Only staff members can view users" };
    }

    const {
      search,
      isActive,
      isSuspended,
      emailVerified,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      perPage = 10,
    } = query;

    const pageNum = parseInt(page.toString(), 10) || 1;
    const perPageNum = parseInt(perPage.toString(), 10) || 10;

    const where: any = {};

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== undefined && isActive !== "all" && isActive !== false) {
      where.isActive = isActive === "true" || isActive === true;
    }

    if (isSuspended !== undefined && isSuspended !== "all" && isSuspended !== false) {
      where.isSuspended = isSuspended === "true" || isSuspended === true;
    }

    if (emailVerified !== undefined && emailVerified !== "all" && emailVerified !== false) {
      where.emailVerified = emailVerified === "true" || emailVerified === true;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          profileImage: true,
          isActive: true,
          isSuspended: true,
          suspendedAt: true,
          suspendedReason: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              comments: true,
              favorites: true,
              playlists: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (pageNum - 1) * perPageNum,
        take: perPageNum,
      }),
      prisma.user.count({ where }),
    ]);

    const allUsers = await prisma.user.findMany({
      select: {
        isActive: true,
        isSuspended: true,
        emailVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.isActive && !u.isSuspended).length,
      suspended: allUsers.filter(u => u.isSuspended).length,
      verified: allUsers.filter(u => u.emailVerified).length,
      newUsers: allUsers.filter(u => u.createdAt >= thirtyDaysAgo).length,
      activeLastMonth: allUsers.filter(u => u.lastLoginAt && u.lastLoginAt >= thirtyDaysAgo).length,
      unverified: allUsers.filter(u => !u.emailVerified).length,
    };

    return {
      users: users.map((user) => ({
        ...user,
        activityCount: user._count.comments + user._count.favorites + user._count.playlists,
        joinedAt: user.createdAt.toISOString(),
        lastActive: user.updatedAt.toISOString(),
      })),
      stats,
      pagination: {
        page: pageNum,
        perPage: perPageNum,
        total,
        totalPages: Math.ceil(total / perPageNum),
      },
    };
  }

  async updateUserStatus(id: string, data: any) {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        isSuspended: true,
        suspendedAt: true,
        suspendedReason: true,
      },
    });
    return user;
  }

  async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }
}