"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("../controllers/settings.controller");
const settings_service_1 = require("../services/settings.service");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
const settingsService = new settings_service_1.SettingsService();
const settingsController = new settings_controller_1.SettingsController(settingsService);
// Public route
router.get("/public", (req, res) => settingsController.getPublicSettings(req, res));
// Admin routes (moderator+ only)
router.get("/", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => settingsController.getSettings(req, res));
router.put("/", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => settingsController.updateSettings(req, res));
router.post("/maintenance", auth_1.authMiddleware, auth_1.requireModerator, (req, res) => settingsController.toggleMaintenance(req, res));
exports.default = router;
//# sourceMappingURL=settings.routes.js.map