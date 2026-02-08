"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const logger_1 = __importDefault(require("../../../utils/logger"));
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res) {
        try {
            const loginData = req.body;
            const result = await this.authService.login(loginData);
            const cookieOptions = {
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
        }
        catch (error) {
            const email = req.body?.email || 'unknown';
            logger_1.default.error(`🔐 LOGIN_FAILED (${email}): ${error?.message || 'Unknown error'}`);
            res.status(error?.statusCode || 500).json({ error: error?.message || "Login failed" });
        }
    }
    async register(req, res) {
        try {
            const { userType, ...registerData } = req.body;
            let result;
            if (userType === 'staff') {
                result = await this.authService.registerStaff(registerData);
            }
            else {
                result = await this.authService.register(registerData);
            }
            res.status(201).json(result);
        }
        catch (error) {
            logger_1.default.error("Register error", { error: error?.message || error });
            res.status(error?.statusCode || 500).json({ error: error?.message || "Registration failed" });
        }
    }
    async registerStaff(req, res) {
        try {
            const registerData = req.body;
            const result = await this.authService.registerStaff(registerData);
            res.status(201).json(result);
        }
        catch (error) {
            logger_1.default.error("Register staff error", { error: error?.message || error });
            res.status(error?.statusCode || 500).json({ error: error?.message || "Staff registration failed" });
        }
    }
    async me(req, res) {
        try {
            const user = req.user;
            if (!user) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            res.json({ user });
        }
        catch (error) {
            logger_1.default.error("Me error", { error: error?.message || error });
            res.status(500).json({ error: error?.message || "Failed to get user info" });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie("token");
            res.json({ message: "Logged out successfully" });
        }
        catch (error) {
            logger_1.default.error("Logout error", { error: error?.message || error });
            res.status(500).json({ error: error?.message || "Logout failed" });
        }
    }
    async verifyEmail(req, res) {
        try {
            const { token } = req.body;
            const result = await this.authService.verifyEmail(token);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Verify email error", { error: error?.message || error });
            res.status(error?.statusCode || 500).json({ error: error?.message || "Email verification failed" });
        }
    }
    async verifyEmailByToken(req, res) {
        try {
            const { token } = req.params;
            const result = await this.authService.verifyEmail(token);
            // Redirect to frontend with success message
            const redirectUrl = `${process.env.FRONTEND_URL}/login?verified=true`;
            res.redirect(redirectUrl);
        }
        catch (error) {
            logger_1.default.error("Verify email error", { error: error?.message || error });
            // Redirect to frontend with error message
            const redirectUrl = `${process.env.FRONTEND_URL}/login?verified=false&error=${encodeURIComponent(error?.message || 'Verification failed')}`;
            res.redirect(redirectUrl);
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await this.authService.forgotPassword(email);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Forgot password error", { error: error?.message || error });
            res.status(error?.statusCode || 500).json({ error: error?.message || "Forgot password failed" });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            const result = await this.authService.resetPassword(token, password);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Reset password error", { error: error?.message || error });
            res.status(error?.statusCode || 500).json({ error: error?.message || "Reset password failed" });
        }
    }
    async resendVerification(req, res) {
        try {
            const { email } = req.body;
            const result = await this.authService.resendVerificationEmail(email);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Resend verification error", { error: error?.message || error });
            res.status(error?.statusCode || 500).json({ error: error?.message || "Failed to resend verification email" });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map