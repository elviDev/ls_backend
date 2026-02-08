import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service";
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getContentAnalytics(req: Request, res: Response): Promise<void>;
    getUserAnalytics(req: Request, res: Response): Promise<void>;
    getLiveAnalytics(req: Request, res: Response): Promise<void>;
    getDashboardStats(req: Request, res: Response): Promise<void>;
    getPodcastAnalytics(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=analytics.controller.d.ts.map