"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const analytics_service_1 = require("../services/analytics.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const analyticsService = new analytics_service_1.AnalyticsService();
const analyticsController = new analytics_controller_1.AnalyticsController(analyticsService);
// Staff can view basic analytics
router.get("/content", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => analyticsController.getContentAnalytics(req, res));
router.get("/users", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => analyticsController.getUserAnalytics(req, res));
router.get("/live", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => analyticsController.getLiveAnalytics(req, res));
router.get("/dashboard", auth_1.authMiddleware, auth_1.requireStaff, (req, res) => analyticsController.getDashboardStats(req, res));
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map