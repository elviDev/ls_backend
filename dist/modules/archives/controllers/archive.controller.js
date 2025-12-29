"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchiveController = void 0;
const logger_1 = require("../../../utils/logger");
class ArchiveController {
    constructor(archiveService, commentService, reviewService) {
        this.archiveService = archiveService;
        this.commentService = commentService;
        this.reviewService = reviewService;
    }
    async getArchives(req, res) {
        try {
            const query = {
                type: req.query.type,
                category: req.query.category,
                featured: req.query.featured === "true",
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search,
            };
            const result = await this.archiveService.getArchives(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getArchiveById(req, res) {
        try {
            const { id } = req.params;
            const archive = await this.archiveService.getArchiveById(id);
            res.json(archive);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createArchive(req, res) {
        try {
            const archiveData = req.body;
            const createdById = req.user.id;
            const archive = await this.archiveService.createArchive(archiveData, createdById);
            res.status(201).json(archive);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateArchive(req, res) {
        try {
            const { id } = req.params;
            const archiveData = req.body;
            const userId = req.user.id;
            const archive = await this.archiveService.updateArchive(id, archiveData, userId);
            res.json(archive);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteArchive(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.archiveService.deleteArchive(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getComments(req, res) {
        try {
            const { id } = req.params;
            const result = await this.commentService.getComments('archive', id);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createComment(req, res) {
        try {
            const { id } = req.params;
            const commentData = { ...req.body, archiveId: id };
            const userId = req.user.id;
            const result = await this.commentService.createComment(commentData, userId);
            res.status(201).json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getReviews(req, res) {
        try {
            const { id } = req.params;
            const result = await this.reviewService.getReviews('archive', id);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createReview(req, res) {
        try {
            const { id } = req.params;
            const reviewData = { ...req.body, archiveId: id };
            const userId = req.user.id;
            const result = await this.reviewService.createReview(reviewData, userId);
            res.status(201).json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async toggleFavorite(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.archiveService.toggleFavorite(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'archives', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.ArchiveController = ArchiveController;
//# sourceMappingURL=archive.controller.js.map