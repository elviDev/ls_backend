"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const logger_1 = require("../../../utils/logger");
class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadSingle(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file provided" });
                return;
            }
            const { description = '', tags = '' } = req.body;
            const uploadedById = req.user.id;
            const result = await this.uploadService.uploadFile(req.file, description, tags, uploadedById);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'upload', action: 'Upload single error' });
            res.status(500).json({ error: error.message });
        }
    }
    async uploadMultiple(req, res) {
        try {
            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                res.status(400).json({ error: "No files provided" });
                return;
            }
            const uploadedById = req.user.id;
            const result = await this.uploadService.uploadMultipleFiles(req.files, uploadedById);
            res.json(result);
        }
        catch (error) {
            (0, logger_1.logError)(error, { module: 'upload', action: 'Upload multiple error' });
            res.status(500).json({ error: error.message });
        }
    }
}
exports.UploadController = UploadController;
//# sourceMappingURL=upload.controller.js.map