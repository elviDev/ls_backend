import { prisma } from "../../../lib/prisma";
import { LoginDto, RegisterDto, RegisterStaffDto, AuthResponse } from "../dto/auth.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logAuth, logDatabase, logError } from "../../../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export class AuthService {
  async login(loginData: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginData;

    // Check staff first
    const staffUser = await prisma.staff.findUnique({
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
      regularUser = await prisma.user.findUnique({
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
      logAuth('login_failed', undefined, email);
      throw { statusCode: 401, message: "Invalid email or password" };
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      logAuth('login_failed', user.id, email);
      throw { statusCode: 401, message: "Invalid email or password" };
    }

    if (!user.emailVerified) {
      throw { statusCode: 403, message: "Please verify your email before logging in" };
    }

    if (isStaff && !staffUser!.isApproved) {
      throw { statusCode: 403, message: "Your account is pending approval" };
    }

    if (isStaff && !staffUser!.isActive) {
      throw { statusCode: 403, message: "Your account has been deactivated" };
    }

    if (!isStaff && (!regularUser!.isActive || regularUser!.isSuspended)) {
      throw { statusCode: 403, message: "Your account has been suspended" };
    }

    const token = jwt.sign(
      { 
        userId: user.id,
        userType: isStaff ? "staff" : "user"
      },
      JWT_SECRET,
      { expiresIn: loginData.rememberMe ? "30d" : "1d" }
    );

    let userData;
    if (isStaff && staffUser) {
      userData = {
        id: staffUser.id,
        email: staffUser.email,
        name: `${staffUser.firstName} ${staffUser.lastName}`,
        role: staffUser.role,
        isApproved: staffUser.isApproved,
        userType: 'staff' as const,
        firstName: staffUser.firstName,
        lastName: staffUser.lastName,
      };
    } else if (regularUser) {
      userData = {
        id: regularUser.id,
        email: regularUser.email,
        name: regularUser.name,
        role: 'USER',
        isApproved: true,
        userType: 'user' as const,
      };
    }

    logAuth('login_success', user.id, email);
    return { token, user: userData! };
  }

  async register(registerData: RegisterDto): Promise<{ message: string }> {
    const { email, password, name, username, bio, phone } = registerData;

    // Check if email exists
    const [existingUser, existingStaff] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.staff.findUnique({ where: { email } })
    ]);

    if (existingUser || existingStaff) {
      throw { statusCode: 400, message: "Email already in use" };
    }

    // Check username if provided
    if (username) {
      const [existingUserUsername, existingStaffUsername] = await Promise.all([
        prisma.user.findFirst({ where: { username } }),
        prisma.staff.findUnique({ where: { username } })
      ]);

      if (existingUserUsername || existingStaffUsername) {
        throw { statusCode: 400, message: "Username already taken" };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const finalName = name || email.split('@')[0];

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: finalName,
        username: username || null,
        bio: bio || null,
      },
    });
    logDatabase('create', 'user', user.id);
    logAuth('register_success', user.id, email);

    // Create verification token
    const token = this.generateToken();
    await prisma.userVerificationToken.create({
      data: {
        token,
        userId: user.id,
        type: "email_verification",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    return { message: "User account created. Verification email sent." };
  }

  async registerStaff(registerData: RegisterStaffDto): Promise<{ message: string }> {
    const { email, password, firstName, lastName, username, role, bio, department, position, phone, address, emergencyContact } = registerData;

    // Check if email exists
    const [existingUser, existingStaff] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.staff.findUnique({ where: { email } })
    ]);

    if (existingUser || existingStaff) {
      throw { statusCode: 400, message: "Email already in use" };
    }

    // Check username
    const [existingUserUsername, existingStaffUsername] = await Promise.all([
      prisma.user.findFirst({ where: { username } }),
      prisma.staff.findUnique({ where: { username } })
    ]);

    if (existingUserUsername || existingStaffUsername) {
      throw { statusCode: 400, message: "Username already taken" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const staff = await prisma.staff.create({
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
    logDatabase('create', 'staff', staff.id);
    logAuth('staff_register', staff.id, email);

    return { message: "Staff account created. Pending approval." };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const verificationToken = await prisma.userVerificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verificationToken || verificationToken.expiresAt < new Date()) {
      throw { statusCode: 400, message: "Invalid or expired token" };
    }

    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true }
    });

    await prisma.userVerificationToken.delete({
      where: { token }
    });

    return { message: "Email verified successfully" };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "If email exists, reset link has been sent" };
    }

    const token = this.generateToken();
    await prisma.userVerificationToken.create({
      data: {
        token,
        userId: user.id,
        type: "password_reset",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
      },
    });

    return { message: "Password reset link sent to your email" };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const resetToken = await prisma.userVerificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetToken || resetToken.expiresAt < new Date() || resetToken.type !== "password_reset") {
      throw { statusCode: 400, message: "Invalid or expired token" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword }
    });

    await prisma.userVerificationToken.delete({
      where: { token }
    });

    return { message: "Password reset successfully" };
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}