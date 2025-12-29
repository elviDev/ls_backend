"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const logger_1 = require("../../../utils/logger");
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
            logger_1.logger.error("Login error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async register(req, res) {
        try {
            const registerData = req.body;
            const result = await this.authService.register(registerData);
            res.status(201).json(result);
        }
        catch (error) {
            logger_1.logger.error("Register error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async registerStaff(req, res) {
        try {
            const registerData = req.body;
            const result = await this.authService.registerStaff(registerData);
            res.status(201).json(result);
        }
        catch (error) {
            logger_1.logger.error("Register staff error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
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
            logger_1.logger.error("Me error", { error: error.message });
            res.status(500).json({ error: error.message });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie("token");
            res.json({ message: "Logged out successfully" });
        }
        catch (error) {
            logger_1.logger.error("Logout error", { error: error.message });
            res.status(500).json({ error: error.message });
        }
    }
    async verifyEmail(req, res) {
        try {
            const { token } = req.body;
            const result = await this.authService.verifyEmail(token);
            res.json(result);
        }
        catch (error) {
            logger_1.logger.error("Verify email error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await this.authService.forgotPassword(email);
            res.json(result);
        }
        catch (error) {
            logger_1.logger.error("Forgot password error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            const result = await this.authService.resetPassword(token, password);
            res.json(result);
        }
        catch (error) {
            logger_1.logger.error("Reset password error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map