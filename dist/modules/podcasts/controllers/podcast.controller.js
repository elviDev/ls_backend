"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastController = void 0;
const prisma_1 = require("../../../lib/prisma");
const asset_service_1 = require("../../assets/services/asset.service");
const logger_1 = __importDefault(require("../../../utils/logger"));
class PodcastController {
    constructor(podcastService, commentService, reviewService) {
        this.podcastService = podcastService;
        this.commentService = commentService;
        this.reviewService = reviewService;
        this.assetService = new asset_service_1.AssetService();
    }
    async getPodcasts(req, res) {
        try {
            const query = {
                featured: req.query.featured === "true",
                limit: parseInt(req.query.limit) || 10,
                category: req.query.category,
                genreId: req.query.genreId,
                dashboard: req.query.dashboard === "true",
                status: req.query.status,
            };
            const userId = req.user?.id; // Optional user ID for personalization
            const result = await this.podcastService.getPodcasts(query, userId);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Get podcasts error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getPodcastById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id; // Optional user ID for favorite status
            const podcast = await this.podcastService.getPodcastById(id, userId);
            res.json(podcast);
        }
        catch (error) {
            logger_1.default.error("Get podcast by ID error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createPodcast(req, res) {
        try {
            let imageUrl = '';
            // Handle asset reference for image (from asset repository)
            if (req.body.imageAssetId) {
                const asset = await prisma_1.prisma.asset.findUnique({
                    where: { id: req.body.imageAssetId },
                    select: { url: true }
                });
                if (asset) {
                    imageUrl = asset.url;
                }
            }
            // Handle new file upload - create asset through AssetService
            else if (req.files?.coverImage?.[0]) {
                const file = req.files.coverImage[0];
                const asset = await this.assetService.createAsset(file, req.user.id, {
                    type: 'IMAGE',
                    description: `Podcast cover image for ${req.body.title}`,
                    tags: 'podcast,cover,image'
                });
                imageUrl = asset.url;
            }
            // Handle direct image URL (if provided)
            else if (req.body.image) {
                imageUrl = req.body.image;
            }
            // Extract data from FormData
            const podcastData = {
                title: req.body.title,
                slug: req.body.slug || req.body.title?.toLowerCase().replace(/\s+/g, '-'),
                description: req.body.description,
                category: req.body.category,
                image: imageUrl,
                coverImage: imageUrl, // Set both image and coverImage
                host: req.body.host || req.body.hostId,
                genreId: req.body.genreId,
                releaseDate: req.body.releaseDate,
                tags: req.body.tags
            };
            const authorId = req.user.id;
            const podcast = await this.podcastService.createPodcast(podcastData, authorId);
            logger_1.default.info("Podcast created", { podcastId: podcast.id });
            res.status(201).json(podcast);
        }
        catch (error) {
            logger_1.default.error("Create podcast error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updatePodcast(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            let imageUrl = req.body.image || '';
            // Handle asset reference for image
            if (req.body.imageAssetId) {
                const asset = await prisma_1.prisma.asset.findUnique({
                    where: { id: req.body.imageAssetId },
                    select: { url: true }
                });
                if (asset) {
                    imageUrl = asset.url;
                }
            }
            // Extract data from FormData
            const podcastData = {
                ...req.body,
                image: imageUrl || req.body.image,
            };
            const podcast = await this.podcastService.updatePodcast(id, podcastData, userId);
            res.json(podcast);
        }
        catch (error) {
            logger_1.default.error("Update podcast error", { error: error.message });
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
            logger_1.default.error("Delete podcast error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async createEpisode(req, res) {
        try {
            const { id: podcastId } = req.params;
            const userId = req.user.id;
            let audioUrl = '';
            // Handle asset reference vs file upload
            if (req.body.audioAssetId) {
                // If using an asset from the library, fetch the asset URL
                const asset = await prisma_1.prisma.asset.findUnique({
                    where: { id: req.body.audioAssetId },
                    select: { url: true }
                });
                if (asset) {
                    audioUrl = asset.url;
                }
            }
            else if (req.files?.audioFile?.[0]?.buffer) {
                // If uploading a new file, set placeholder for now
                audioUrl = 'uploaded';
            }
            // Extract data from FormData
            const episodeData = {
                title: req.body.title,
                description: req.body.description || '',
                audioUrl,
                duration: parseInt(req.body.duration) || 0,
                episodeNumber: parseInt(req.body.episodeNumber) || 1,
            };
            const episode = await this.podcastService.createEpisode(podcastId, episodeData, userId);
            res.status(201).json(episode);
        }
        catch (error) {
            logger_1.default.error("Create episode error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getEpisodes(req, res) {
        try {
            const { id: podcastId } = req.params;
            const userId = req.user?.id; // Optional user ID for favorite status
            const episodes = await this.podcastService.getEpisodes(podcastId, userId);
            res.json(episodes);
        }
        catch (error) {
            logger_1.default.error("Get episodes error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getEpisodeById(req, res) {
        try {
            // Handle both /episodes/:episodeId and /:id/episodes/:episodeId routes
            const episodeId = req.params.episodeId || req.params.id;
            const episode = await this.podcastService.getEpisodeById(episodeId);
            res.json(episode);
        }
        catch (error) {
            logger_1.default.error("Get episode by ID error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateEpisode(req, res) {
        try {
            // Handle both /:id/episodes/:episodeId and /episodes/:episodeId routes
            const episodeId = req.params.episodeId || req.params.id;
            const episodeData = req.body;
            const userId = req.user.id;
            const episode = await this.podcastService.updateEpisode(episodeId, episodeData, userId);
            res.json(episode);
        }
        catch (error) {
            logger_1.default.error("Update episode error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteEpisode(req, res) {
        try {
            // Handle both /:id/episodes/:episodeId and /episodes/:episodeId routes
            const episodeId = req.params.episodeId || req.params.id;
            const userId = req.user.id;
            const result = await this.podcastService.deleteEpisode(episodeId, userId);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Delete episode error", { error: error.message });
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
            logger_1.default.error("Get comments error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getEpisodeComments(req, res) {
        try {
            const { episodeId } = req.params;
            const result = await this.commentService.getComments('podcastEpisode', episodeId);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Get episode comments error", { error: error.message });
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
            logger_1.default.error("Create comment error", { error: error.message });
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
            logger_1.default.error("Get reviews error", { error: error.message });
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
            logger_1.default.error("Create review error", { error: error.message });
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
            logger_1.default.error("Toggle favorite error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    // Episode Comments
    async createEpisodeComment(req, res) {
        try {
            const { episodeId } = req.params;
            const commentData = { ...req.body, podcastEpisodeId: episodeId };
            const userId = req.user.id;
            const result = await this.commentService.createComment(commentData, userId);
            res.status(201).json(result);
        }
        catch (error) {
            logger_1.default.error("Create episode comment error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    // Episode Reviews
    async createEpisodeReview(req, res) {
        try {
            const { episodeId } = req.params;
            const reviewData = { ...req.body, podcastEpisodeId: episodeId };
            const userId = req.user.id;
            const result = await this.reviewService.createReview(reviewData, userId);
            res.status(201).json(result);
        }
        catch (error) {
            logger_1.default.error("Create episode review error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.PodcastController = PodcastController;
//# sourceMappingURL=podcast.controller.js.map