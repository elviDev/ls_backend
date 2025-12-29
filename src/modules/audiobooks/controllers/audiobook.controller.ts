import { Request, Response } from "express";
import { AudiobookService } from "../services/audiobook.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
import {
  AudiobookDto,
  ChapterDto,
  AudiobookQueryDto,
} from "../dto/audiobook.dto";
import { CommentDto } from "../../comments/dto/comment.dto";
import { ReviewDto } from "../../reviews/dto/review.dto";
import { logError } from "../../../utils/logger";

export class AudiobookController {
  constructor(
    private audiobookService: AudiobookService,
    private commentService: CommentService,
    private reviewService: ReviewService
  ) {}

  async getAudiobooks(req: Request, res: Response): Promise<void> {
    try {
      const query: AudiobookQueryDto = {
        featured: req.query.featured === "true",
        limit: parseInt(req.query.limit as string) || 10,
        genreId: req.query.genreId as string,
        author: req.query.author as string,
        language: req.query.language as string,
      };

      const result = await this.audiobookService.getAudiobooks(query);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getAudiobookById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const audiobook = await this.audiobookService.getAudiobookById(id);
      res.json(audiobook);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createAudiobook(req: Request, res: Response): Promise<void> {
    try {
      const audiobookData: AudiobookDto = req.body;
      const createdById = req.user!.id;

      const audiobook = await this.audiobookService.createAudiobook(
        audiobookData,
        createdById
      );
      res.status(201).json(audiobook);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateAudiobook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const audiobookData: Partial<AudiobookDto> = req.body;
      const userId = req.user!.id;

      const audiobook = await this.audiobookService.updateAudiobook(
        id,
        audiobookData,
        userId
      );
      res.json(audiobook);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteAudiobook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.audiobookService.deleteAudiobook(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getChapters(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.audiobookService.getChapters(id);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createChapter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const chapterData: ChapterDto = req.body;
      const userId = req.user!.id;

      const chapter = await this.audiobookService.createChapter(
        id,
        chapterData,
        userId
      );
      res.status(201).json(chapter);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.commentService.getComments("audiobook", id);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const commentData: CommentDto = { ...req.body, audiobookId: id };
      const userId = req.user!.id;

      const result = await this.commentService.createComment(
        commentData,
        userId
      );
      res.status(201).json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.reviewService.getReviews("audiobook", id);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reviewData: ReviewDto = { ...req.body, audiobookId: id };
      const userId = req.user!.id;

      const result = await this.reviewService.createReview(reviewData, userId);
      res.status(201).json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.audiobookService.toggleFavorite(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
