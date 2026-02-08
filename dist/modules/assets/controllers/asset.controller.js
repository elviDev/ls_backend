"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const logger_1 = __importDefault(require("../../../utils/logger"));
class AssetController {
    constructor(assetService) {
        this.assetService = assetService;
    }
    async createAsset(req, res) {
        try {
            const files = req.files;
            const file = files?.file?.[0];
            if (!file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }
            const userId = req.user.id;
            const { type, description, tags } = req.body;
            const asset = await this.assetService.createAsset(file, userId, {
                type,
                description,
                tags,
            });
            res.json(asset);
        }
        catch (error) {
            logger_1.default.error("Asset creation error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getAssets(req, res) {
        try {
            const query = {
                type: req.query.type,
                limit: parseInt(req.query.limit) || 20,
                search: req.query.search,
            };
            const userId = req.user.id;
            const result = await this.assetService.getAssets(query, userId);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Get assets error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async getAssetById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const asset = await this.assetService.getAssetById(id, userId);
            res.json(asset);
        }
        catch (error) {
            logger_1.default.error("Get asset by ID error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async updateAsset(req, res) {
        try {
            const { id } = req.params;
            const assetData = req.body;
            const userId = req.user.id;
            const asset = await this.assetService.updateAsset(id, assetData, userId);
            res.json(asset);
        }
        catch (error) {
            logger_1.default.error("Update asset error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async deleteAsset(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const result = await this.assetService.deleteAsset(id, userId);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Delete asset error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async uploadFlexible(req, res) {
        try {
            const files = req.files;
            if (!files || files.length === 0) {
                res.status(400).json({ error: "No files uploaded" });
                return;
            }
            const userId = req.user.id;
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
            }
            else {
                // Handle multiple files
                const result = await this.assetService.uploadMultipleFiles(files, userId);
                res.json(result);
            }
        }
        catch (error) {
            logger_1.default.error("Flexible asset upload error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    async uploadMultiple(req, res) {
        try {
            const files = req.files;
            if (!files || files.length === 0) {
                res.status(400).json({ error: "No files uploaded" });
                return;
            }
            const userId = req.user.id;
            const result = await this.assetService.uploadMultipleFiles(files, userId);
            res.json(result);
        }
        catch (error) {
            logger_1.default.error("Multiple asset upload error", { error: error.message });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.AssetController = AssetController;
//# sourceMappingURL=asset.controller.js.map