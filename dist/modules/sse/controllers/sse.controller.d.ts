import { Request, Response } from "express";
import { SSEService } from "../services/sse.service";
export declare class SSEController {
    private sseService;
    constructor(sseService: SSEService);
    connect(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=sse.controller.d.ts.map