import { Request, Response } from "express";
import { GenreService } from "../services/genre.service";
import { GenreDto } from "../dto/genre.dto";
import { logError } from "../../../utils/logger";

export class GenreController {
  constructor(private genreService: GenreService) {}

  async getGenres(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.genreService.getGenres();
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "genres",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getGenreById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const genre = await this.genreService.getGenreById(id);
      res.json(genre);
    } catch (error: any) {
      logError(error, {
        module: "genres",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createGenre(req: Request, res: Response): Promise<void> {
    try {
      const genreData: GenreDto = req.body;
      const genre = await this.genreService.createGenre(genreData);
      res.status(201).json(genre);
    } catch (error: any) {
      logError(error, {
        module: "genres",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateGenre(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const genreData: Partial<GenreDto> = req.body;
      const genre = await this.genreService.updateGenre(id, genreData);
      res.json(genre);
    } catch (error: any) {
      logError(error, {
        module: "genres",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteGenre(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.genreService.deleteGenre(id);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "genres",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
