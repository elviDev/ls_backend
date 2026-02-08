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
            const userId = req.user?.id; // Optional user ID for personalization
            const result = await this.audiobookService.getAudiobooks(query, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getAudiobookById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id; // Optional user ID for favorite status
            const audiobook = await this.audiobookService.getAudiobookById(id, userId);
            res.json(audiobook);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
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
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
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
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
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
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
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
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createChapter(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const audioFile = req.file;
            // Convert FormData string values to proper types
            const chapterData = {
                ...req.body,
                duration: req.body.duration ? parseInt(req.body.duration) : 0,
                trackNumber: req.body.trackNumber ? parseInt(req.body.trackNumber) : 1,
                status: req.body.isDraft ? (req.body.isDraft === 'true' ? 'DRAFT' : 'PUBLISHED') : 'DRAFT',
            };
            // Remove isDraft from the data since it's not a valid field
            delete chapterData.isDraft;
            const chapter = await this.audiobookService.createChapter(id, chapterData, userId, audioFile);
            res.status(201).json(chapter);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getChapter(req, res) {
        try {
            const { id, chapterId } = req.params;
            const chapter = await this.audiobookService.getChapter(id, chapterId);
            res.json(chapter);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getComments(req, res) {
        try {
            const { id } = req.params;
            const result = await this.commentService.getComments("audiobook", id);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
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
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getReviews(req, res) {
        try {
            const { id } = req.params;
            const result = await this.reviewService.getReviews("audiobook", id);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
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
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getStats(req, res) {
        try {
            const stats = await this.audiobookService.getAudiobookStats();
            res.json(stats);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateChapter(req, res) {
        try {
            const { id, chapterId } = req.params;
            const userId = req.user.id;
            const audioFile = req.file;
            // Convert FormData string values to proper types
            const chapterData = {
                ...req.body,
                duration: req.body.duration ? parseInt(req.body.duration) : undefined,
                trackNumber: req.body.trackNumber ? parseInt(req.body.trackNumber) : undefined,
                status: req.body.isDraft ? (req.body.isDraft === 'true' ? 'DRAFT' : 'PUBLISHED') : undefined,
            };
            // Remove isDraft from the data since it's not a valid field
            delete chapterData.isDraft;
            const chapter = await this.audiobookService.updateChapter(id, chapterId, chapterData, userId, audioFile);
            res.json(chapter);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteChapter(req, res) {
        try {
            const { id, chapterId } = req.params;
            const userId = req.user.id;
            const result = await this.audiobookService.deleteChapter(id, chapterId, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
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
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async saveProgress(req, res) {
        try {
            const { id } = req.params;
            const { position, chapterId } = req.body;
            const userId = req.user.id;
            const result = await this.audiobookService.saveProgress(id, userId, position, chapterId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getProgress(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.audiobookService.getProgress(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async toggleBookmark(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.audiobookService.toggleBookmark(id, userId);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, {
                module: "audiobooks",
                action: req.method + " " + req.originalUrl,
            });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.AudiobookController = AudiobookController;
//# sourceMappingURL=audiobook.controller.js.map