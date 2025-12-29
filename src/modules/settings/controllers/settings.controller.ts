import { Request, Response } from "express";
import { SettingsService } from "../services/settings.service";
import { SettingsDto } from "../dto/settings.dto";
import { logError } from "../../../utils/logger";

export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  async getSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await this.settingsService.getSettings();
      res.json(settings);
    } catch (error: any) {
      logError(error, { module: "settings", action: "Get settings error" });
      res.status(500).json({ error: error.message });
    }
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const settingsData: SettingsDto = req.body;
      const userId = req.user!.id;

      const settings = await this.settingsService.updateSettings(
        settingsData,
        userId
      );
      res.json(settings);
    } catch (error: any) {
      logError(error, { module: "settings", action: "Update settings error" });
      res.status(500).json({ error: error.message });
    }
  }

  async getPublicSettings(req: Request, res: Response): Promise<void> {
    try {
      const settings = await this.settingsService.getPublicSettings();
      res.json(settings);
    } catch (error: any) {
      logError(error, {
        module: "settings",
        action: "Get public settings error",
      });
      res.status(500).json({ error: error.message });
    }
  }

  async toggleMaintenance(req: Request, res: Response): Promise<void> {
    try {
      const { enabled, message } = req.body;
      const userId = req.user!.id;

      const settings = await this.settingsService.toggleMaintenanceMode(
        enabled,
        message,
        userId
      );
      res.json(settings);
    } catch (error: any) {
      logError(error, {
        module: "settings",
        action: "Toggle maintenance error",
      });
      res.status(500).json({ error: error.message });
    }
  }
}
