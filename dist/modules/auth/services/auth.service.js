"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../../../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
class AuthService {
    async login(loginData) {
        const { email, password } = loginData;
        // Check staff first
        const staffUser = await prisma_1.prisma.staff.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                role: true,
                isApproved: true,
                emailVerified: true,
                isActive: true,
            }
        });
        // Check regular user if not staff
        let regularUser = null;
        if (!staffUser) {
            regularUser = await prisma_1.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    password: true,
                    name: true,
                    emailVerified: true,
                    isActive: true,
                    isSuspended: true,
                }
            });
        }
        const user = staffUser || regularUser;
        const isStaff = !!staffUser;
        if (!user) {
            (0, logger_1.logAuth)('login_failed', undefined, email);
            throw { statusCode: 401, message: "Invalid credentials" };
        }
        const passwordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordValid) {
            (0, logger_1.logAuth)('login_failed', user.id, email);
            throw { statusCode: 401, message: "Invalid credentials" };
        }
        if (!user.emailVerified) {
            throw { statusCode: 403, message: "Please verify your email" };
        }
        if (isStaff && !staffUser.isApproved) {
            throw { statusCode: 403, message: "Your account is pending approval" };
        }
        if (isStaff && !staffUser.isActive) {
            throw { statusCode: 403, message: "Your account is inactive" };
        }
        if (!isStaff && (!regularUser.isActive || regularUser.isSuspended)) {
            throw { statusCode: 403, message: "Your account is suspended" };
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            userType: isStaff ? "staff" : "user"
        }, JWT_SECRET, { expiresIn: loginData.rememberMe ? "30d" : "1d" });
        let userData;
        if (isStaff && staffUser) {
            userData = {
                id: staffUser.id,
                email: staffUser.email,
                name: `${staffUser.firstName} ${staffUser.lastName}`,
                role: staffUser.role,
                isApproved: staffUser.isApproved,
                userType: 'staff',
                firstName: staffUser.firstName,
                lastName: staffUser.lastName,
            };
        }
        else if (regularUser) {
            userData = {
                id: regularUser.id,
                email: regularUser.email,
                name: regularUser.name,
                role: 'USER',
                isApproved: true,
                userType: 'user',
            };
        }
        (0, logger_1.logAuth)('login_success', user.id, email);
        return { token, user: userData };
    }
    async register(registerData) {
        const { email, password, name, firstName, lastName, username } = registerData;
        // Check if email exists
        const [existingUser, existingStaff] = await Promise.all([
            prisma_1.prisma.user.findUnique({ where: { email } }),
            prisma_1.prisma.staff.findUnique({ where: { email } })
        ]);
        if (existingUser || existingStaff) {
            throw { statusCode: 400, message: "Email already in use" };
        }
        // Check username if provided
        if (username) {
            const [existingUserUsername, existingStaffUsername] = await Promise.all([
                prisma_1.prisma.user.findFirst({ where: { username } }),
                prisma_1.prisma.staff.findUnique({ where: { username } })
            ]);
            if (existingUserUsername || existingStaffUsername) {
                throw { statusCode: 400, message: "Username already taken" };
            }
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const finalName = name || (firstName && lastName ? `${firstName} ${lastName}` : email.split('@')[0]);
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: finalName,
                username: username || null,
            },
        });
        (0, logger_1.logDatabase)('create', 'user', user.id);
        (0, logger_1.logAuth)('register_success', user.id, email);
        // Create verification token
        const token = this.generateToken();
        await prisma_1.prisma.userVerificationToken.create({
            data: {
                token,
                userId: user.id,
                type: "email_verification",
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
        });
        return { message: "User account created. Verification email sent." };
    }
    async registerStaff(registerData) {
        const { email, password, firstName, lastName, username, role } = registerData;
        // Check if email exists
        const [existingUser, existingStaff] = await Promise.all([
            prisma_1.prisma.user.findUnique({ where: { email } }),
            prisma_1.prisma.staff.findUnique({ where: { email } })
        ]);
        if (existingUser || existingStaff) {
            throw { statusCode: 400, message: "Email already in use" };
        }
        // Check username
        const [existingUserUsername, existingStaffUsername] = await Promise.all([
            prisma_1.prisma.user.findFirst({ where: { username } }),
            prisma_1.prisma.staff.findUnique({ where: { username } })
        ]);
        if (existingUserUsername || existingStaffUsername) {
            throw { statusCode: 400, message: "Username already taken" };
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const staff = await prisma_1.prisma.staff.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                username,
                role,
                isApproved: false,
                emailVerified: false,
            },
        });
        (0, logger_1.logDatabase)('create', 'staff', staff.id);
        (0, logger_1.logAuth)('staff_register', staff.id, email);
        return { message: "Staff account created. Pending approval." };
    }
    async verifyEmail(token) {
        const verificationToken = await prisma_1.prisma.userVerificationToken.findUnique({
            where: { token },
            include: { user: true }
        });
        if (!verificationToken || verificationToken.expiresAt < new Date()) {
            throw { statusCode: 400, message: "Invalid or expired token" };
        }
        await prisma_1.prisma.user.update({
            where: { id: verificationToken.userId },
            data: { emailVerified: true }
        });
        await prisma_1.prisma.userVerificationToken.delete({
            where: { token }
        });
        return { message: "Email verified successfully" };
    }
    async forgotPassword(email) {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: "If email exists, reset link has been sent" };
        }
        const token = this.generateToken();
        await prisma_1.prisma.userVerificationToken.create({
            data: {
                token,
                userId: user.id,
                type: "password_reset",
                expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
            },
        });
        return { message: "Password reset link sent to your email" };
    }
    async resetPassword(token, newPassword) {
        const resetToken = await prisma_1.prisma.userVerificationToken.findUnique({
            where: { token },
            include: { user: true }
        });
        if (!resetToken || resetToken.expiresAt < new Date() || resetToken.type !== "password_reset") {
            throw { statusCode: 400, message: "Invalid or expired token" };
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await prisma_1.prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword }
        });
        await prisma_1.prisma.userVerificationToken.delete({
            where: { token }
        });
        return { message: "Password reset successfully" };
    }
    generateToken() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map