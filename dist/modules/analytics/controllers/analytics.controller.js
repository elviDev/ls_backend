"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const logger_1 = require("../../../utils/logger");
class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getContentAnalytics(req, res) {
        try {
            const query = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const result = await this.analyticsService.getContentAnalytics(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "analytics",
                action: "Get content analytics error",
            });
            res.status(500).json({ error: error.message });
        }
    }
    async getUserAnalytics(req, res) {
        try {
            const query = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const result = await this.analyticsService.getUserAnalytics(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "analytics",
                action: "Get user analytics error",
            });
            res.status(500).json({ error: error.message });
        }
    }
    async getLiveAnalytics(req, res) {
        try {
            const query = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const result = await this.analyticsService.getLiveAnalytics(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "analytics",
                action: "Get live analytics error",
            });
            res.status(500).json({ error: error.message });
        }
    }
    async getDashboardStats(req, res) {
        try {
            const result = await this.analyticsService.getDashboardStats();
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "analytics",
                action: "Get dashboard stats error",
            });
            res.status(500).json({ error: error.message });
        }
    }
    async getPodcastAnalytics(req, res) {
        try {
            const query = {
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const result = await this.analyticsService.getPodcastAnalytics(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "analytics",
                action: "Get podcast analytics error",
            });
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map