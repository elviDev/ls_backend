import { Request, Response } from "express";
import { UploadService } from "../services/upload.service";
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    uploadSingle(req: Request, res: Response): Promise<void>;
    uploadMultiple(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=upload.controller.d.ts.map