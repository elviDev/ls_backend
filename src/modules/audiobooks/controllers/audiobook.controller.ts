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
      const userId = req.user?.id; // Optional user ID for personalization

      const result = await this.audiobookService.getAudiobooks(query, userId);
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
      const userId = req.user?.id; // Optional user ID for favorite status
      const audiobook = await this.audiobookService.getAudiobookById(id, userId);
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
      const userId = req.user!.id;
      const audioFile = req.file;

      // Convert FormData string values to proper types
      const chapterData: ChapterDto = {
        ...req.body,
        duration: req.body.duration ? parseInt(req.body.duration) : 0,
        trackNumber: req.body.trackNumber ? parseInt(req.body.trackNumber) : 1,
        status: req.body.isDraft ? (req.body.isDraft === 'true' ? 'DRAFT' : 'PUBLISHED') : 'DRAFT',
      };

      // Remove isDraft from the data since it's not a valid field
      delete (chapterData as any).isDraft;

      const chapter = await this.audiobookService.createChapter(
        id,
        chapterData,
        userId,
        audioFile
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

  async getChapter(req: Request, res: Response): Promise<void> {
    try {
      const { id, chapterId } = req.params;
      const chapter = await this.audiobookService.getChapter(id, chapterId);
      res.json(chapter);
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

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.audiobookService.getAudiobookStats();
      res.json(stats);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateChapter(req: Request, res: Response): Promise<void> {
    try {
      const { id, chapterId } = req.params;
      const userId = req.user!.id;
      const audioFile = req.file;

      // Convert FormData string values to proper types
      const chapterData: Partial<ChapterDto> = {
        ...req.body,
        duration: req.body.duration ? parseInt(req.body.duration) : undefined,
        trackNumber: req.body.trackNumber ? parseInt(req.body.trackNumber) : undefined,
        status: req.body.isDraft ? (req.body.isDraft === 'true' ? 'DRAFT' : 'PUBLISHED') : undefined,
      };

      // Remove isDraft from the data since it's not a valid field
      delete (chapterData as any).isDraft;

      const chapter = await this.audiobookService.updateChapter(
        id,
        chapterId,
        chapterData,
        userId,
        audioFile
      );
      res.json(chapter);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteChapter(req: Request, res: Response): Promise<void> {
    try {
      const { id, chapterId } = req.params;
      const userId = req.user!.id;

      const result = await this.audiobookService.deleteChapter(
        id,
        chapterId,
        userId
      );
      res.json(result);
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

  async saveProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { position, chapterId } = req.body;
      const userId = req.user!.id;

      const result = await this.audiobookService.saveProgress(id, userId, position, chapterId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.audiobookService.getProgress(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "audiobooks",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async toggleBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.audiobookService.toggleBookmark(id, userId);
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