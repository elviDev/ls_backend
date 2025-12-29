import { Request, Response } from "express";
import { SettingsService } from "../services/settings.service";
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getSettings(req: Request, res: Response): Promise<void>;
    updateSettings(req: Request, res: Response): Promise<void>;
    getPublicSettings(req: Request, res: Response): Promise<void>;
    toggleMaintenance(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=settings.controller.d.ts.map