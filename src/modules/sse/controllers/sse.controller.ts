import { Request, Response } from "express";
import { SSEService } from "../services/sse.service";
import { logError } from "../../../utils/logger";

export class SSEController {
  constructor(private sseService: SSEService) {}

  async connect(req: Request, res: Response): Promise<void> {
    try {
      const clientId = req.query.clientId as string || `client_${Date.now()}`;
      const userId = (req as any).user?.id;
      
      this.sseService.addClient(res, clientId, userId);
    } catch (error: any) {
      logError(error, { module: 'sse', action: 'connect' });
      res.status(500).json({ error: error.message });
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = {
        activeClients: this.sseService.getActiveClientCount(),
        activeBroadcasts: this.sseService.getActiveBroadcasts()
      };
      res.json(stats);
    } catch (error: any) {
      logError(error, { module: 'sse', action: 'getStats' });
      res.status(500).json({ error: error.message });
    }
  }
}