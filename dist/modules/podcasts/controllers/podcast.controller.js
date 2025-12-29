"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastController = void 0;
const logger_1 = require("../../../utils/logger");
class PodcastController {
    constructor(podcastService, commentService, reviewService) {
        this.podcastService = podcastService;
        this.commentService = commentService;
        this.reviewService = reviewService;
    }
    async getPodcasts(req, res) {
        try {
            const query = {
                featured: req.query.featured === "true",
                limit: parseInt(req.query.limit) || 10,
                category: req.query.category,
                genreId: req.query.genreId,
            };
            const result = await this.podcastService.getPodcasts(query);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'podcasts', action: 'getPodcasts' });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getPodcastById(req, res) {
        try {
            const { id } = req.params;
            const podcast = await this.podcastService.getPodcastById(id);
            res.json(podcast);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'podcasts', action: 'getPodcastById', podcastId: req.params.id });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createPodcast(req, res) {
        try {
            const podcastData = req.body;
            const authorId = req.user.id;
            const podcast = await this.podcastService.createPodcast(podcastData, authorId);
            (0, logger_1.logDatabase)('create', 'podcast', podcast.id);
            res.status(201).json(podcast);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'podcasts', action: 'createPodcast', authorId });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updatePodcast(req, res) {
        try {
            const { id } = req.params;
            const podcastData = req.body;
            const userId = req.user.id;
            const podcast = await this.podcastService.updatePodcast(id, podcastData, userId);
            res.json(podcast);
        }
        catch (error) {
            logger.error("Update podcast error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deletePodcast(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.podcastService.deletePodcast(id, userId);
            res.json(result);
        }
        catch (error) {
            logger.error("Delete podcast error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createEpisode(req, res) {
        try {
            const { id: podcastId } = req.params;
            const episodeData = req.body;
            const userId = req.user.id;
            const episode = await this.podcastService.createEpisode(podcastId, episodeData, userId);
            res.status(201).json(episode);
        }
        catch (error) {
            logger.error("Create episode error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getEpisodes(req, res) {
        try {
            const { id: podcastId } = req.params;
            const episodes = await this.podcastService.getEpisodes(podcastId);
            res.json(episodes);
        }
        catch (error) {
            logger.error("Get episodes error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getEpisodeById(req, res) {
        try {
            const { episodeId } = req.params;
            const episode = await this.podcastService.getEpisodeById(episodeId);
            res.json(episode);
        }
        catch (error) {
            logger.error("Get episode by ID error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateEpisode(req, res) {
        try {
            const { episodeId } = req.params;
            const episodeData = req.body;
            const userId = req.user.id;
            const episode = await this.podcastService.updateEpisode(episodeId, episodeData, userId);
            res.json(episode);
        }
        catch (error) {
            logger.error("Update episode error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteEpisode(req, res) {
        try {
            const { episodeId } = req.params;
            const userId = req.user.id;
            const result = await this.podcastService.deleteEpisode(episodeId, userId);
            res.json(result);
        }
        catch (error) {
            logger.error("Delete episode error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    // Comments
    async getComments(req, res) {
        try {
            const { id } = req.params;
            const result = await this.commentService.getComments('podcast', id);
            res.json(result);
        }
        catch (error) {
            logger.error("Get comments error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createComment(req, res) {
        try {
            const { id } = req.params;
            const commentData = { ...req.body, podcastId: id };
            const userId = req.user.id;
            const result = await this.commentService.createComment(commentData, userId);
            res.status(201).json(result);
        }
        catch (error) {
            logger.error("Create comment error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    // Reviews
    async getReviews(req, res) {
        try {
            const { id } = req.params;
            const result = await this.reviewService.getReviews('podcast', id);
            res.json(result);
        }
        catch (error) {
            logger.error("Get reviews error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createReview(req, res) {
        try {
            const { id } = req.params;
            const reviewData = { ...req.body, podcastId: id };
            const userId = req.user.id;
            const result = await this.reviewService.createReview(reviewData, userId);
            res.status(201).json(result);
        }
        catch (error) {
            logger.error("Create review error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    // Favorites
    async toggleFavorite(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.podcastService.toggleFavorite(id, userId);
            res.json(result);
        }
        catch (error) {
            logger.error("Toggle favorite error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.PodcastController = PodcastController;
//# sourceMappingURL=podcast.controller.js.map