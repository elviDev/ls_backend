import { Request, Response } from "express";
import { ProgramService } from "../services/program.service";
import { ProgramDto, ProgramEpisodeDto } from "../dto/program.dto";
import { logError } from "../../../utils/logger";

export class ProgramController {
  constructor(private programService: ProgramService) {}

  async getPrograms(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.programService.getPrograms();
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "programs",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getProgramById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const program = await this.programService.getProgramById(id);
      res.json(program);
    } catch (error: any) {
      logError(error, {
        module: "programs",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createProgram(req: Request, res: Response): Promise<void> {
    try {
      const programData: ProgramDto = req.body;
      const hostId = req.user!.id;
      const program = await this.programService.createProgram(
        programData,
        hostId
      );
      res.status(201).json(program);
    } catch (error: any) {
      logError(error, {
        module: "programs",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateProgram(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const programData: Partial<ProgramDto> = req.body;
      const userId = req.user!.id;
      const program = await this.programService.updateProgram(
        id,
        programData,
        userId
      );
      res.json(program);
    } catch (error: any) {
      logError(error, {
        module: "programs",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteProgram(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await this.programService.deleteProgram(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "programs",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createEpisode(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const episodeData: ProgramEpisodeDto = req.body;
      const userId = req.user!.id;
      const episode = await this.programService.createEpisode(
        id,
        episodeData,
        userId
      );
      res.status(201).json(episode);
    } catch (error: any) {
      logError(error, {
        module: "programs",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
