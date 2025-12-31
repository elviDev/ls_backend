import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
import { PodcastService } from "../services/podcast.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
import { AssetService } from "../../assets/services/asset.service";
import { PodcastDto, PodcastEpisodeDto, PodcastQueryDto } from "../dto/podcast.dto";
import { CommentDto } from "../../comments/dto/comment.dto";
import { ReviewDto } from "../../reviews/dto/review.dto";
import logger from "../../../utils/logger";

export class PodcastController {
  private assetService = new AssetService();
  
  constructor(
    private podcastService: PodcastService,
    private commentService: CommentService,
    private reviewService: ReviewService
  ) {}

  async getPodcasts(req: Request, res: Response): Promise<void> {
    try {
      const query: PodcastQueryDto = {
        featured: req.query.featured === "true",
        limit: parseInt(req.query.limit as string) || 10,
        category: req.query.category as string,
        genreId: req.query.genreId as string,
        dashboard: req.query.dashboard === "true",
        status: req.query.status as string,
      };
      const userId = req.user?.id; // Optional user ID for personalization

      const result = await this.podcastService.getPodcasts(query, userId);
      res.json(result);
    } catch (error: any) {
      logger.error("Get podcasts error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getPodcastById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id; // Optional user ID for favorite status
      const podcast = await this.podcastService.getPodcastById(id, userId);
      res.json(podcast);
    } catch (error: any) {
      logger.error("Get podcast by ID error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createPodcast(req: Request, res: Response): Promise<void> {
    try {
      let imageUrl = '';
      
      // Handle asset reference for image (from asset repository)
      if (req.body.imageAssetId) {
        const asset = await prisma.asset.findUnique({
          where: { id: req.body.imageAssetId },
          select: { url: true }
        });
        if (asset) {
          imageUrl = asset.url;
        }
      }
      // Handle new file upload - create asset through AssetService
      else if ((req.files as any)?.coverImage?.[0]) {
        const file = (req.files as any).coverImage[0];
        const asset = await this.assetService.createAsset(
          file, 
          req.user!.id, 
          {
            type: 'IMAGE',
            description: `Podcast cover image for ${req.body.title}`,
            tags: 'podcast,cover,image'
          }
        );
        
        imageUrl = asset.url;
      }
      // Handle direct image URL (if provided)
      else if (req.body.image) {
        imageUrl = req.body.image;
      }
      
      // Extract data from FormData
      const podcastData: PodcastDto = {
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
      
      const authorId = req.user!.id;
      
      const podcast = await this.podcastService.createPodcast(podcastData, authorId);
      logger.info("Podcast created", { podcastId: podcast.id });
      res.status(201).json(podcast);
    } catch (error: any) {
      logger.error("Create podcast error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updatePodcast(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      let imageUrl = req.body.image || '';
      
      // Handle asset reference for image
      if (req.body.imageAssetId) {
        const asset = await prisma.asset.findUnique({
          where: { id: req.body.imageAssetId },
          select: { url: true }
        });
        if (asset) {
          imageUrl = asset.url;
        }
      }
      
      // Extract data from FormData
      const podcastData: Partial<PodcastDto> = {
        ...req.body,
        image: imageUrl || req.body.image,
      };
      
      const podcast = await this.podcastService.updatePodcast(id, podcastData, userId);
      res.json(podcast);
    } catch (error: any) {
      logger.error("Update podcast error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deletePodcast(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      const result = await this.podcastService.deletePodcast(id, userId);
      res.json(result);
    } catch (error: any) {
      logger.error("Delete podcast error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createEpisode(req: Request, res: Response): Promise<void> {
    try {
      const { id: podcastId } = req.params;
      const userId = req.user!.id;
      
      let audioUrl = '';
      
      // Handle asset reference vs file upload
      if (req.body.audioAssetId) {
        // If using an asset from the library, fetch the asset URL
        const asset = await prisma.asset.findUnique({
          where: { id: req.body.audioAssetId },
          select: { url: true }
        });
        if (asset) {
          audioUrl = asset.url;
        }
      } else if ((req.files as any)?.audioFile?.[0]?.buffer) {
        // If uploading a new file, set placeholder for now
        audioUrl = 'uploaded';
      }
      
      // Extract data from FormData
      const episodeData: PodcastEpisodeDto = {
        title: req.body.title,
        description: req.body.description || '',
        audioUrl,
        duration: parseInt(req.body.duration) || 0,
        episodeNumber: parseInt(req.body.episodeNumber) || 1,
      };
      
      const episode = await this.podcastService.createEpisode(podcastId, episodeData, userId);
      res.status(201).json(episode);
    } catch (error: any) {
      logger.error("Create episode error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getEpisodes(req: Request, res: Response): Promise<void> {
    try {
      const { id: podcastId } = req.params;
      const userId = req.user?.id; // Optional user ID for favorite status
      const episodes = await this.podcastService.getEpisodes(podcastId, userId);
      res.json(episodes);
    } catch (error: any) {
      logger.error("Get episodes error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getEpisodeById(req: Request, res: Response): Promise<void> {
    try {
      // Handle both /episodes/:episodeId and /:id/episodes/:episodeId routes
      const episodeId = req.params.episodeId || req.params.id;
      const episode = await this.podcastService.getEpisodeById(episodeId);
      res.json(episode);
    } catch (error: any) {
      logger.error("Get episode by ID error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateEpisode(req: Request, res: Response): Promise<void> {
    try {
      // Handle both /:id/episodes/:episodeId and /episodes/:episodeId routes
      const episodeId = req.params.episodeId || req.params.id;
      const episodeData: Partial<PodcastEpisodeDto> = req.body;
      const userId = req.user!.id;
      
      const episode = await this.podcastService.updateEpisode(episodeId, episodeData, userId);
      res.json(episode);
    } catch (error: any) {
      logger.error("Update episode error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteEpisode(req: Request, res: Response): Promise<void> {
    try {
      // Handle both /:id/episodes/:episodeId and /episodes/:episodeId routes
      const episodeId = req.params.episodeId || req.params.id;
      const userId = req.user!.id;
      
      const result = await this.podcastService.deleteEpisode(episodeId, userId);
      res.json(result);
    } catch (error: any) {
      logger.error("Delete episode error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // Comments
  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.commentService.getComments('podcast', id);
      res.json(result);
    } catch (error: any) {
      logger.error("Get comments error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getEpisodeComments(req: Request, res: Response): Promise<void> {
    try {
      const { episodeId } = req.params;
      const result = await this.commentService.getComments('podcastEpisode', episodeId);
      res.json(result);
    } catch (error: any) {
      logger.error("Get episode comments error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const commentData: CommentDto = { ...req.body, podcastId: id };
      const userId = req.user!.id;
      
      const result = await this.commentService.createComment(commentData, userId);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("Create comment error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // Reviews
  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.reviewService.getReviews('podcast', id);
      res.json(result);
    } catch (error: any) {
      logger.error("Get reviews error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reviewData: ReviewDto = { ...req.body, podcastId: id };
      const userId = req.user!.id;
      
      const result = await this.reviewService.createReview(reviewData, userId);
      res.status(201).json(result);
    } catch (error: any) {
      logger.error("Create review error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  // Favorites
  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      const result = await this.podcastService.toggleFavorite(id, userId);
      res.json(result);
    } catch (error: any) {
      logger.error("Toggle favorite error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}