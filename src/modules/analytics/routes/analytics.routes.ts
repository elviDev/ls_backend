import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { AnalyticsService } from "../services/analytics.service";
import { authMiddleware, requireStaff, requireModerator } from "../../../middleware/auth";

const router = Router();
const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);

// Staff can view basic analytics
router.get("/content", authMiddleware, requireStaff, (req, res) => analyticsController.getContentAnalytics(req, res));
router.get("/users", authMiddleware, requireModerator, (req, res) => analyticsController.getUserAnalytics(req, res));
router.get("/live", authMiddleware, requireStaff, (req, res) => analyticsController.getLiveAnalytics(req, res));
router.get("/dashboard", authMiddleware, requireStaff, (req, res) => analyticsController.getDashboardStats(req, res));
router.get("/podcasts", authMiddleware, requireStaff, (req, res) => analyticsController.getPodcastAnalytics(req, res));

export default router;