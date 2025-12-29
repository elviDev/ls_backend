"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const logger_1 = require("../../../utils/logger");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const profile = await this.userService.getUserProfile(userId);
            res.json(profile);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const userData = req.body;
            const updatedProfile = await this.userService.updateProfile(userId, userData);
            res.json(updatedProfile);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const passwordData = req.body;
            const result = await this.userService.changePassword(userId, passwordData);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getFavorites(req, res) {
        try {
            const userId = req.user.id;
            const favorites = await this.userService.getFavorites(userId);
            res.json(favorites);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getPublicProfile(req, res) {
        try {
            const { userId } = req.params;
            const profile = await this.userService.getPublicProfile(userId);
            res.json(profile);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'users', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map