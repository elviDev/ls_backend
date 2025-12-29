"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastController = void 0;
const logger_1 = require("../../../utils/logger");
class BroadcastController {
    constructor(broadcastService) {
        this.broadcastService = broadcastService;
    }
    async getBroadcasts(req, res) {
        try {
            const query = {
                status: req.query.status,
                limit: parseInt(req.query.limit) || 10,
                programId: req.query.programId,
            };
            const broadcasts = await this.broadcastService.getBroadcasts(query);
            res.json(broadcasts);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getCurrentBroadcast(req, res) {
        try {
            const broadcast = await this.broadcastService.getCurrentBroadcast();
            res.json(broadcast);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getUpcomingBroadcasts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const broadcasts = await this.broadcastService.getUpcomingBroadcasts(limit);
            res.json(broadcasts);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createBroadcast(req, res) {
        try {
            const broadcastData = req.body;
            const createdById = req.user.id;
            const broadcast = await this.broadcastService.createBroadcast(broadcastData, createdById);
            res.status(201).json(broadcast);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateBroadcast(req, res) {
        try {
            const { id } = req.params;
            const broadcastData = req.body;
            const userId = req.user.id;
            const broadcast = await this.broadcastService.updateBroadcast(id, broadcastData, userId);
            res.json(broadcast);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async startBroadcast(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const broadcast = await this.broadcastService.startBroadcast(id, userId);
            res.json(broadcast);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async endBroadcast(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const broadcast = await this.broadcastService.endBroadcast(id, userId);
            res.json(broadcast);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getBroadcastEvents(req, res) {
        try {
            const events = await this.broadcastService.getBroadcastEvents();
            res.json(events);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getBroadcastById(req, res) {
        try {
            const { id } = req.params;
            const broadcast = await this.broadcastService.getBroadcastById(id);
            if (!broadcast) {
                res.status(404).json({ error: "Broadcast not found" });
                return;
            }
            res.json(broadcast);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteBroadcast(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.broadcastService.deleteBroadcast(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "broadcasts",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.BroadcastController = BroadcastController;
//# sourceMappingURL=broadcast.controller.js.map