"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudiobookController = void 0;
const logger_1 = require("../../../utils/logger");
class AudiobookController {
    constructor(audiobookService, commentService, reviewService) {
        this.audiobookService = audiobookService;
        this.commentService = commentService;
        this.reviewService = reviewService;
    }
    async getAudiobooks(req, res) {
        try {
            const query = {
                featured: req.query.featured === "true",
                limit: parseInt(req.query.limit) || 10,
                genreId: req.query.genreId,
                author: req.query.author,
                language: req.query.language,
            };
            const result = await this.audiobookService.getAudiobooks(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getAudiobookById(req, res) {
        try {
            const { id } = req.params;
            const audiobook = await this.audiobookService.getAudiobookById(id);
            res.json(audiobook);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createAudiobook(req, res) {
        try {
            const audiobookData = req.body;
            const createdById = req.user.id;
            const audiobook = await this.audiobookService.createAudiobook(audiobookData, createdById);
            res.status(201).json(audiobook);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateAudiobook(req, res) {
        try {
            const { id } = req.params;
            const audiobookData = req.body;
            const userId = req.user.id;
            const audiobook = await this.audiobookService.updateAudiobook(id, audiobookData, userId);
            res.json(audiobook);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteAudiobook(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.audiobookService.deleteAudiobook(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getChapters(req, res) {
        try {
            const { id } = req.params;
            const result = await this.audiobookService.getChapters(id);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createChapter(req, res) {
        try {
            const { id } = req.params;
            const chapterData = req.body;
            const userId = req.user.id;
            const chapter = await this.audiobookService.createChapter(id, chapterData, userId);
            res.status(201).json(chapter);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getComments(req, res) {
        try {
            const { id } = req.params;
            const result = await this.commentService.getComments('audiobook', id);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createComment(req, res) {
        try {
            const { id } = req.params;
            const commentData = { ...req.body, audiobookId: id };
            const userId = req.user.id;
            const result = await this.commentService.createComment(commentData, userId);
            res.status(201).json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getReviews(req, res) {
        try {
            const { id } = req.params;
            const result = await this.reviewService.getReviews('audiobook', id);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createReview(req, res) {
        try {
            const { id } = req.params;
            const reviewData = { ...req.body, audiobookId: id };
            const userId = req.user.id;
            const result = await this.reviewService.createReview(reviewData, userId);
            res.status(201).json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async toggleFavorite(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.audiobookService.toggleFavorite(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'audiobooks', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.AudiobookController = AudiobookController;
//# sourceMappingURL=audiobook.controller.js.map