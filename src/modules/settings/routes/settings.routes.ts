import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller";
import { SettingsService } from "../services/settings.service";
import { authMiddleware, requireModerator } from "../../../middleware/auth";

const router = Router();
const settingsService = new SettingsService();
const settingsController = new SettingsController(settingsService);

// Public route
router.get("/public", (req, res) => settingsController.getPublicSettings(req, res));

// Admin routes (moderator+ only)
router.get("/", authMiddleware, requireModerator, (req, res) => settingsController.getSettings(req, res));
router.put("/", authMiddleware, requireModerator, (req, res) => settingsController.updateSettings(req, res));
router.post("/maintenance", authMiddleware, requireModerator, (req, res) => settingsController.toggleMaintenance(req, res));

export default router;