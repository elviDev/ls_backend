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
const email_service_1 = require("../../email/services/email.service");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
class AuthService {
    constructor() {
        this.emailService = new email_service_1.EmailService();
    }
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
            throw { statusCode: 401, message: "Invalid email or password" };
        }
        const passwordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordValid) {
            (0, logger_1.logAuth)('login_failed', user.id, email);
            throw { statusCode: 401, message: "Invalid email or password" };
        }
        if (!user.emailVerified) {
            // Resend verification email for both users and staff
            try {
                let token;
                if (isStaff) {
                    // Check if there's an existing token for staff
                    const existingToken = await prisma_1.prisma.verificationToken.findFirst({
                        where: {
                            userId: user.id,
                            type: 'email_verification',
                            expiresAt: { gt: new Date() }
                        }
                    });
                    if (existingToken) {
                        token = existingToken.token;
                    }
                    else {
                        // Create new token for staff
                        token = this.generateToken();
                        await prisma_1.prisma.verificationToken.create({
                            data: {
                                token,
                                userId: user.id,
                                type: 'email_verification',
                                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                            },
                        });
                    }
                    // Resend verification email for staff
                    const staffName = `${staffUser.firstName} ${staffUser.lastName}`;
                    await this.emailService.sendVerificationEmail(email, token, staffName);
                }
                else {
                    // Check if there's an existing token for regular user
                    const existingToken = await prisma_1.prisma.userVerificationToken.findFirst({
                        where: {
                            userId: user.id,
                            type: 'email_verification',
                            expiresAt: { gt: new Date() }
                        }
                    });
                    if (existingToken) {
                        token = existingToken.token;
                    }
                    else {
                        // Create new token for regular user
                        token = this.generateToken();
                        await prisma_1.prisma.userVerificationToken.create({
                            data: {
                                token,
                                userId: user.id,
                                type: 'email_verification',
                                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                            },
                        });
                    }
                    // Resend verification email for user
                    await this.emailService.sendVerificationEmail(email, token, regularUser.name);
                }
                throw {
                    statusCode: 403,
                    message: "Please verify your email before logging in. A new verification email has been sent.",
                    emailResent: true
                };
            }
            catch (error) {
                if (error.emailResent) {
                    throw error;
                }
                throw { statusCode: 403, message: "Please verify your email before logging in" };
            }
        }
        if (isStaff && !staffUser.isApproved) {
            throw { statusCode: 403, message: "Your account is pending approval" };
        }
        if (isStaff && !staffUser.isActive) {
            throw { statusCode: 403, message: "Your account has been deactivated" };
        }
        if (!isStaff && (!regularUser.isActive || regularUser.isSuspended)) {
            throw { statusCode: 403, message: "Your account has been suspended" };
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
        const { email, password, name, username, bio, phone } = registerData;
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
        const finalName = name || email.split('@')[0];
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: finalName,
                username: username || null,
                bio: bio || null,
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
        // Send verification email
        try {
            await this.emailService.sendVerificationEmail(email, token, finalName);
        }
        catch (error) {
            (0, logger_1.logError)('Failed to send verification email', { email, error });
            // Don't throw error - user is created, just email failed
        }
        return { message: "User account created. Verification email sent." };
    }
    async registerStaff(registerData) {
        const { email, password, firstName, lastName, username, role, bio, department, position, phone, address, emergencyContact } = registerData;
        // Check if trying to register as ADMIN and one already exists
        if (role === 'ADMIN') {
            const existingAdmin = await prisma_1.prisma.staff.findFirst({
                where: { role: 'ADMIN' }
            });
            if (existingAdmin) {
                throw { statusCode: 400, message: "There can only be one admin. Please contact the existing admin or choose a different role." };
            }
        }
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
                bio: bio || null,
                department: department || null,
                position: position || null,
                phone: phone || null,
                address: address || null,
                emergencyContact: emergencyContact || null,
                isApproved: false,
                emailVerified: false,
            },
        });
        (0, logger_1.logDatabase)('create', 'staff', staff.id);
        (0, logger_1.logAuth)('staff_register', staff.id, email);
        // Create verification token for staff
        const token = this.generateToken();
        await prisma_1.prisma.verificationToken.create({
            data: {
                token,
                userId: staff.id,
                type: 'email_verification',
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
        });
        // Send verification email to staff
        try {
            const staffName = `${firstName} ${lastName}`;
            await this.emailService.sendVerificationEmail(email, token, staffName);
        }
        catch (error) {
            (0, logger_1.logError)('Failed to send staff verification email', { email, error });
            // Don't throw error - staff is created, just email failed
        }
        return { message: "Staff account created. Please verify your email and wait for admin approval." };
    }
    async verifyEmail(token) {
        // Try to find token in UserVerificationToken first
        const userVerificationToken = await prisma_1.prisma.userVerificationToken.findUnique({
            where: { token },
            include: { user: true }
        });
        if (userVerificationToken) {
            if (userVerificationToken.expiresAt < new Date()) {
                throw { statusCode: 400, message: "Invalid or expired token" };
            }
            await prisma_1.prisma.user.update({
                where: { id: userVerificationToken.userId },
                data: { emailVerified: true }
            });
            await prisma_1.prisma.userVerificationToken.delete({
                where: { token }
            });
            // Send welcome email
            try {
                await this.emailService.sendWelcomeEmail(userVerificationToken.user.email, userVerificationToken.user.name);
            }
            catch (error) {
                (0, logger_1.logError)('Failed to send welcome email', { email: userVerificationToken.user.email, error });
            }
            return { message: "Email verified successfully" };
        }
        // Try to find token in VerificationToken (for Staff)
        const staffVerificationToken = await prisma_1.prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true }
        });
        if (staffVerificationToken) {
            if (staffVerificationToken.expiresAt < new Date()) {
                throw { statusCode: 400, message: "Invalid or expired token" };
            }
            await prisma_1.prisma.staff.update({
                where: { id: staffVerificationToken.userId },
                data: { emailVerified: true }
            });
            await prisma_1.prisma.verificationToken.delete({
                where: { token }
            });
            // Send welcome email for staff
            try {
                const staffName = `${staffVerificationToken.user.firstName} ${staffVerificationToken.user.lastName}`;
                await this.emailService.sendWelcomeEmail(staffVerificationToken.user.email, staffName);
            }
            catch (error) {
                (0, logger_1.logError)('Failed to send welcome email', { email: staffVerificationToken.user.email, error });
            }
            return { message: "Email verified successfully. Your account is pending admin approval." };
        }
        throw { statusCode: 400, message: "Invalid or expired token" };
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
        // Send password reset email
        try {
            await this.emailService.sendPasswordResetEmail(email, token, user.name);
        }
        catch (error) {
            (0, logger_1.logError)('Failed to send password reset email', { email, error });
        }
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
    async resendVerificationEmail(email) {
        // Check if user exists (regular user)
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (user) {
            if (user.emailVerified) {
                throw { statusCode: 400, message: "Email is already verified" };
            }
            // Delete old tokens
            await prisma_1.prisma.userVerificationToken.deleteMany({
                where: {
                    userId: user.id,
                    type: 'email_verification'
                }
            });
            // Create new token
            const token = this.generateToken();
            await prisma_1.prisma.userVerificationToken.create({
                data: {
                    token,
                    userId: user.id,
                    type: 'email_verification',
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                },
            });
            // Send verification email
            try {
                await this.emailService.sendVerificationEmail(email, token, user.name);
            }
            catch (error) {
                (0, logger_1.logError)('Failed to resend verification email', { email, error });
                throw { statusCode: 500, message: "Failed to send verification email" };
            }
            return { message: "Verification email sent successfully" };
        }
        // Check if staff exists
        const staff = await prisma_1.prisma.staff.findUnique({ where: { email } });
        if (staff) {
            if (staff.emailVerified) {
                throw { statusCode: 400, message: "Email is already verified" };
            }
            // Delete old tokens
            await prisma_1.prisma.verificationToken.deleteMany({
                where: {
                    userId: staff.id,
                    type: 'email_verification'
                }
            });
            // Create new token
            const token = this.generateToken();
            await prisma_1.prisma.verificationToken.create({
                data: {
                    token,
                    userId: staff.id,
                    type: 'email_verification',
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
                },
            });
            // Send verification email
            try {
                const staffName = `${staff.firstName} ${staff.lastName}`;
                await this.emailService.sendVerificationEmail(email, token, staffName);
            }
            catch (error) {
                (0, logger_1.logError)('Failed to resend verification email', { email, error });
                throw { statusCode: 500, message: "Failed to send verification email" };
            }
            return { message: "Verification email sent successfully" };
        }
        // Don't reveal if user exists or not
        return { message: "If the email exists and is not verified, a verification email has been sent." };
    }
    generateToken() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map