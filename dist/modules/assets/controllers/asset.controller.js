"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const logger_1 = require("../../../utils/logger");
class AssetController {
    constructor(assetService) {
        this.assetService = assetService;
    }
    async createAsset(req, res) {
        try {
            console.log('File upload request:', {
                files: req.files,
                body: req.body,
                headers: req.headers['content-type']
            });
            const files = req.files;
            const file = files?.file?.[0];
            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const userId = req.user.id;
            const { type, description } = req.body;
            const asset = await this.assetService.createAsset(file, userId, { type, description });
            res.json(asset);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'assets', action: req.method + ' ' + req.originalUrl });
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
            (0, logger_1.logError)(error, { module: 'assets', action: req.method + ' ' + req.originalUrl });
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
            (0, logger_1.logError)(error, { module: 'assets', action: req.method + ' ' + req.originalUrl });
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
            (0, logger_1.logError)(error, { module: 'assets', action: req.method + ' ' + req.originalUrl });
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
            (0, logger_1.logError)(error, { module: 'assets', action: req.method + ' ' + req.originalUrl });
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
exports.AssetController = AssetController;
//# sourceMappingURL=asset.controller.js.map