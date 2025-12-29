import { Request, Response } from "express";
import { BroadcastService } from "../services/broadcast.service";
import { BroadcastDto, BroadcastQueryDto } from "../dto/broadcast.dto";
import { logError, logDatabase } from "../../../utils/logger";

export class BroadcastController {
  constructor(private broadcastService: BroadcastService) {}

  async getBroadcasts(req: Request, res: Response): Promise<void> {
    try {
      const query: BroadcastQueryDto = {
        status: req.query.status as 'SCHEDULED' | 'READY' | 'LIVE' | 'ENDED' | undefined,
        limit: parseInt(req.query.limit as string) || 10,
        programId: req.query.programId as string,
      };

      const broadcasts = await this.broadcastService.getBroadcasts(query);
      res.json(broadcasts);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getCurrentBroadcast(req: Request, res: Response): Promise<void> {
    try {
      const broadcast = await this.broadcastService.getCurrentBroadcast();
      res.json(broadcast);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getUpcomingBroadcasts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const broadcasts = await this.broadcastService.getUpcomingBroadcasts(
        limit
      );
      res.json(broadcasts);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createBroadcast(req: Request, res: Response): Promise<void> {
    try {
      const broadcastData: BroadcastDto = req.body;
      const createdById = req.user!.id;

      const broadcast = await this.broadcastService.createBroadcast(
        broadcastData,
        createdById
      );
      res.status(201).json(broadcast);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateBroadcast(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const broadcastData: Partial<BroadcastDto> = req.body;
      const userId = req.user!.id;

      const broadcast = await this.broadcastService.updateBroadcast(
        id,
        broadcastData,
        userId
      );
      res.json(broadcast);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async startBroadcast(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const broadcast = await this.broadcastService.startBroadcast(id, userId);
      res.json(broadcast);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async endBroadcast(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const broadcast = await this.broadcastService.endBroadcast(id, userId);
      res.json(broadcast);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getBroadcastEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await this.broadcastService.getBroadcastEvents();
      res.json(events);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getBroadcastById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const broadcast = await this.broadcastService.getBroadcastById(id);
      
      if (!broadcast) {
        res.status(404).json({ error: "Broadcast not found" });
        return;
      }
      
      res.json(broadcast);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteBroadcast(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const result = await this.broadcastService.deleteBroadcast(id, userId);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "broadcasts",
        action: req.method + " " + req.originalUrl,
      });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
