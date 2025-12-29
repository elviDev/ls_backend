import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { AnalyticsQueryDto } from "../dto/analytics.dto";
import { logError } from "../../../utils/logger";

export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  async getContentAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const query: AnalyticsQueryDto = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.analyticsService.getContentAnalytics(query);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "analytics",
        action: "Get content analytics error",
      });
      res.status(500).json({ error: error.message });
    }
  }

  async getUserAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const query: AnalyticsQueryDto = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.analyticsService.getUserAnalytics(query);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "analytics",
        action: "Get user analytics error",
      });
      res.status(500).json({ error: error.message });
    }
  }

  async getLiveAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const query: AnalyticsQueryDto = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.analyticsService.getLiveAnalytics(query);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "analytics",
        action: "Get live analytics error",
      });
      res.status(500).json({ error: error.message });
    }
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.analyticsService.getDashboardStats();
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "analytics",
        action: "Get dashboard stats error",
      });
      res.status(500).json({ error: error.message });
    }
  }

  async getPodcastAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const query: AnalyticsQueryDto = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.analyticsService.getPodcastAnalytics(query);
      res.json(result);
    } catch (error: any) {
      logError(error, {
        module: "analytics",
        action: "Get podcast analytics error",
      });
      res.status(500).json({ error: error.message });
    }
  }
}
