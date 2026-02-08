"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramController = void 0;
const asset_service_1 = require("../../assets/services/asset.service");
const logger_1 = require("../../../utils/logger");
class ProgramController {
    constructor(programService) {
        this.programService = programService;
        this.assetService = new asset_service_1.AssetService();
    }
    async getPrograms(req, res) {
        try {
            const query = req.query;
            const result = await this.programService.getPrograms(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getProgramById(req, res) {
        try {
            const { id } = req.params;
            const program = await this.programService.getProgramById(id);
            res.json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getProgramBySlug(req, res) {
        try {
            const { slug } = req.params;
            const program = await this.programService.getProgramBySlug(slug);
            res.json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createProgram(req, res) {
        try {
            const programData = req.body;
            const userId = req.user.id;
            // Use hostId from form data, fallback to current user
            const hostId = programData.hostId || userId;
            // Handle image upload if provided
            if (req.file && req.file.fieldname === 'image') {
                const asset = await this.assetService.createAsset(req.file, userId, { type: "IMAGE" });
                programData.image = asset.url;
            }
            else if (req.body.imageUrl) {
                // Use selected asset URL
                programData.image = req.body.imageUrl;
            }
            const program = await this.programService.createProgram(programData, hostId);
            res.status(201).json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateProgram(req, res) {
        try {
            const { id } = req.params;
            const programData = req.body;
            const userId = req.user.id;
            // Handle image upload if provided
            if (req.file && req.file.fieldname === 'image') {
                const asset = await this.assetService.createAsset(req.file, userId, { type: "IMAGE" });
                programData.image = asset.url;
            }
            else if (req.body.imageUrl) {
                // Use selected asset URL
                programData.image = req.body.imageUrl;
                delete programData.imageUrl; // Remove imageUrl from data
            }
            const program = await this.programService.updateProgram(id, programData);
            res.json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteProgram(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.programService.deleteProgram(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getProgramEpisodes(req, res) {
        try {
            const { id } = req.params;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const result = await this.programService.getProgramEpisodes(id, page, limit);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getEpisodeById(req, res) {
        try {
            const { id, episodeId } = req.params;
            const episode = await this.programService.getEpisodeById(id, episodeId);
            res.json(episode);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createEpisode(req, res) {
        try {
            const { id } = req.params;
            const episodeData = req.body;
            const userId = req.user.id;
            // Handle audio file upload if provided
            if (req.file && req.file.fieldname === 'audioFile') {
                const asset = await this.assetService.createAsset(req.file, userId, { type: "AUDIO" });
                episodeData.audioFile = asset.url;
            }
            const episode = await this.programService.createEpisode(id, episodeData, userId);
            res.status(201).json(episode);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateEpisode(req, res) {
        try {
            const { id, episodeId } = req.params;
            const episodeData = req.body;
            const userId = req.user.id;
            // Handle audio file upload if provided
            if (req.file && req.file.fieldname === 'audioFile') {
                const asset = await this.assetService.createAsset(req.file, userId, { type: "AUDIO" });
                episodeData.audioFile = asset.url;
            }
            const episode = await this.programService.updateEpisode(id, episodeId, episodeData, userId);
            res.json(episode);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteEpisode(req, res) {
        try {
            const { id, episodeId } = req.params;
            const userId = req.user.id;
            const result = await this.programService.deleteEpisode(id, episodeId, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async archiveProgram(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const program = await this.programService.archiveProgram(id, userId);
            res.json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async activateProgram(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const program = await this.programService.activateProgram(id, userId);
            res.json(program);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getProgramAnalytics(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const analytics = await this.programService.getProgramAnalytics(id, userId);
            res.json(analytics);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async linkEpisodeToBroadcast(req, res) {
        try {
            const { id, episodeId } = req.params;
            const { broadcastId } = req.body;
            const userId = req.user.id;
            const episode = await this.programService.linkEpisodeToBroadcast(id, episodeId, broadcastId, userId);
            res.json(episode);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createSchedule(req, res) {
        try {
            const { id } = req.params;
            const scheduleData = req.body;
            const userId = req.user.id;
            const schedule = await this.programService.createSchedule(id, scheduleData, userId);
            res.status(201).json(schedule);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "programs",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.ProgramController = ProgramController;
//# sourceMappingURL=program.controller.js.map