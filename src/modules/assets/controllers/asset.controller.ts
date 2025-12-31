import { Request, Response } from "express";
import { AssetService } from "../services/asset.service";
import { AssetDto, AssetQueryDto } from "../dto/asset.dto";
import logger from "../../../utils/logger";

export class AssetController {
  constructor(private assetService: AssetService) {}

  async createAsset(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const file = files?.file?.[0];

      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const userId = req.user!.id;
      const { type, description, tags } = req.body;
      const asset = await this.assetService.createAsset(file, userId, {
        type,
        description,
        tags,
      });
      res.json(asset);
    } catch (error: any) {
      logger.error("Asset creation error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getAssets(req: Request, res: Response): Promise<void> {
    try {
      const query: AssetQueryDto = {
        type: req.query.type as string,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
      };
      const userId = req.user!.id;

      const result = await this.assetService.getAssets(query, userId);
      res.json(result);
    } catch (error: any) {
      logger.error("Get assets error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getAssetById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const asset = await this.assetService.getAssetById(id, userId);
      res.json(asset);
    } catch (error: any) {
      logger.error("Get asset by ID error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateAsset(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const assetData: Partial<AssetDto> = req.body;
      const userId = req.user!.id;
      const asset = await this.assetService.updateAsset(id, assetData as any, userId);
      res.json(asset);
    } catch (error: any) {
      logger.error("Update asset error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteAsset(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const result = await this.assetService.deleteAsset(id, userId);
      res.json(result);
    } catch (error: any) {
      logger.error("Delete asset error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async uploadFlexible(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      const userId = req.user!.id;
      
      // Handle single file upload
      if (files.length === 1) {
        const file = files[0];
        const { type, description, tags } = req.body;
        const asset = await this.assetService.createAsset(file, userId, {
          type,
          description,
          tags,
        });
        res.json(asset);
      } else {
        // Handle multiple files
        const result = await this.assetService.uploadMultipleFiles(files, userId);
        res.json(result);
      }
    } catch (error: any) {
      logger.error("Flexible asset upload error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async uploadMultiple(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      const userId = req.user!.id;
      const result = await this.assetService.uploadMultipleFiles(files, userId);
      res.json(result);
    } catch (error: any) {
      logger.error("Multiple asset upload error", { error: error.message });
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
