import { Request, Response } from "express";
import { ArchiveService } from "../services/archive.service";
import { CommentService } from "../../comments/services/comment.service";
import { ReviewService } from "../../reviews/services/review.service";
import { ArchiveDto, ArchiveQueryDto } from "../dto/archive.dto";
import { CommentDto } from "../../comments/dto/comment.dto";
import { ReviewDto } from "../../reviews/dto/review.dto";
import { logError } from "../../../utils/logger";

export class ArchiveController {
  constructor(
    private archiveService: ArchiveService,
    private commentService: CommentService,
    private reviewService: ReviewService
  ) {}

  async getArchives(req: Request, res: Response): Promise<void> {
    try {
      const query: ArchiveQueryDto = {
        type: req.query.type as string,
        category: req.query.category as string,
        featured: req.query.featured === "true",
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
      };

      const result = await this.archiveService.getArchives(query);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getArchiveById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const archive = await this.archiveService.getArchiveById(id);
      res.json(archive);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createArchive(req: Request, res: Response): Promise<void> {
    try {
      const archiveData: ArchiveDto = req.body;
      const createdById = req.user!.id;

      const archive = await this.archiveService.createArchive(
        archiveData,
        createdById
      );
      res.status(201).json(archive);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateArchive(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const archiveData: Partial<ArchiveDto> = req.body;
      const userId = req.user!.id;

      const archive = await this.archiveService.updateArchive(
        id,
        archiveData,
        userId
      );
      res.json(archive);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteArchive(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.archiveService.deleteArchive(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.commentService.getComments("archive", id);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const commentData: CommentDto = { ...req.body, archiveId: id };
      const userId = req.user!.id;

      const result = await this.commentService.createComment(
        commentData,
        userId
      );
      res.status(201).json(result);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.reviewService.getReviews("archive", id);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const reviewData: ReviewDto = { ...req.body, archiveId: id };
      const userId = req.user!.id;

      const result = await this.reviewService.createReview(reviewData, userId);
      res.status(201).json(result);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async toggleFavorite(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.archiveService.toggleFavorite(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "archives",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
