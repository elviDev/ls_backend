import { Request, Response } from "express";
import { AssetService } from "../services/asset.service";
export declare class AssetController {
    private assetService;
    constructor(assetService: AssetService);
    createAsset(req: Request, res: Response): Promise<void>;
    getAssets(req: Request, res: Response): Promise<void>;
    getAssetById(req: Request, res: Response): Promise<void>;
    updateAsset(req: Request, res: Response): Promise<void>;
    deleteAsset(req: Request, res: Response): Promise<void>;
    uploadFlexible(req: Request, res: Response): Promise<void>;
    uploadMultiple(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=asset.controller.d.ts.map