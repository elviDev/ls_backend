import { Request, Response } from "express";
import { BroadcastService } from "../services/broadcast.service";
export declare class BroadcastController {
    private broadcastService;
    constructor(broadcastService: BroadcastService);
    getBroadcasts(req: Request, res: Response): Promise<void>;
    getCurrentBroadcast(req: Request, res: Response): Promise<void>;
    getUpcomingBroadcasts(req: Request, res: Response): Promise<void>;
    createBroadcast(req: Request, res: Response): Promise<void>;
    updateBroadcast(req: Request, res: Response): Promise<void>;
    startBroadcast(req: Request, res: Response): Promise<void>;
    endBroadcast(req: Request, res: Response): Promise<void>;
    getBroadcastEvents(req: Request, res: Response): Promise<void>;
    getBroadcastById(req: Request, res: Response): Promise<void>;
    deleteBroadcast(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=broadcast.controller.d.ts.map