"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const logger_1 = require("../../../utils/logger");
class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getSettings(req, res) {
        try {
            const settings = await this.settingsService.getSettings();
            res.json(settings);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: "settings", action: "Get settings error" });
            res.status(500).json({ error: error.message });
        }
    }
    async updateSettings(req, res) {
        try {
            const settingsData = req.body;
            const userId = req.user.id;
            const settings = await this.settingsService.updateSettings(settingsData, userId);
            res.json(settings);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: "settings", action: "Update settings error" });
            res.status(500).json({ error: error.message });
        }
    }
    async getPublicSettings(req, res) {
        try {
            const settings = await this.settingsService.getPublicSettings();
            res.json(settings);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "settings",
                action: "Get public settings error",
            });
            res.status(500).json({ error: error.message });
        }
    }
    async toggleMaintenance(req, res) {
        try {
            const { enabled, message } = req.body;
            const userId = req.user.id;
            const settings = await this.settingsService.toggleMaintenanceMode(enabled, message, userId);
            res.json(settings);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "settings",
                action: "Toggle maintenance error",
            });
            res.status(500).json({ error: error.message });
        }
    }
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings.controller.js.map