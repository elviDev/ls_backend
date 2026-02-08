import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginDto, RegisterDto, RegisterStaffDto } from "../dto/auth.dto";
import logger from "../../../utils/logger";

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginDto = req.body;
      const result = await this.authService.login(loginData);
      
      const cookieOptions: any = {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      };

      if (loginData.rememberMe) {
        cookieOptions.maxAge = 30 * 24 * 60 * 60;
      }

      res.cookie("token", result.token, cookieOptions);
      res.json(result);
    } catch (error: any) {
      const email = req.body?.email || 'unknown';
      logger.error(`🔐 LOGIN_FAILED (${email}): ${error?.message || 'Unknown error'}`);
      res.status(error?.statusCode || 500).json({ error: error?.message || "Login failed" });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { userType, ...registerData } = req.body;
      
      let result;
      if (userType === 'staff') {
        result = await this.authService.registerStaff(registerData as RegisterStaffDto);
      } else {
        result = await this.authService.register(registerData as RegisterDto);
      }
      
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("Register error", { error: error?.message || error });
      res.status(error?.statusCode || 500).json({ error: error?.message || "Registration failed" });
    }
  }

  async registerStaff(req: Request, res: Response): Promise<void> {
    try {
      const registerData: RegisterStaffDto = req.body;
      const result = await this.authService.registerStaff(registerData);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("Register staff error", { error: error?.message || error });
      res.status(error?.statusCode || 500).json({ error: error?.message || "Staff registration failed" });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res.json({ user });
    } catch (error: any) {
      logger.error("Me error", { error: error?.message || error });
      res.status(500).json({ error: error?.message || "Failed to get user info" });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token");
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      logger.error("Logout error", { error: error?.message || error });
      res.status(500).json({ error: error?.message || "Logout failed" });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      const result = await this.authService.verifyEmail(token);
      res.json(result);
    } catch (error: any) {
      logger.error("Verify email error", { error: error?.message || error });
      res.status(error?.statusCode || 500).json({ error: error?.message || "Email verification failed" });
    }
  }

  async verifyEmailByToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const result = await this.authService.verifyEmail(token);
      
      // Redirect to frontend with success message
      const redirectUrl = `${process.env.FRONTEND_URL}/login?verified=true`;
      res.redirect(redirectUrl);
    } catch (error: any) {
      logger.error("Verify email error", { error: error?.message || error });
      
      // Redirect to frontend with error message
      const redirectUrl = `${process.env.FRONTEND_URL}/login?verified=false&error=${encodeURIComponent(error?.message || 'Verification failed')}`;
      res.redirect(redirectUrl);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.json(result);
    } catch (error: any) {
      logger.error("Forgot password error", { error: error?.message || error });
      res.status(error?.statusCode || 500).json({ error: error?.message || "Forgot password failed" });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      const result = await this.authService.resetPassword(token, password);
      res.json(result);
    } catch (error: any) {
      logger.error("Reset password error", { error: error?.message || error });
      res.status(error?.statusCode || 500).json({ error: error?.message || "Reset password failed" });
    }
  }

  async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await this.authService.resendVerificationEmail(email);
      res.json(result);
    } catch (error: any) {
      logger.error("Resend verification error", { error: error?.message || error });
      res.status(error?.statusCode || 500).json({ error: error?.message || "Failed to resend verification email" });
    }
  }
}