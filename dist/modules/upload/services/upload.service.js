"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const prisma_1 = require("../../../lib/prisma");
const promises_1 = require("fs/promises");
const path_1 = require("path");
class UploadService {
    getAssetType(mimeType) {
        if (mimeType.startsWith('image/'))
            return 'IMAGE';
        if (mimeType.startsWith('audio/'))
            return 'AUDIO';
        if (mimeType.startsWith('video/'))
            return 'VIDEO';
        return 'DOCUMENT';
    }
    generateFilename(originalName) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = originalName.split('.').pop();
        return `${timestamp}-${random}.${extension}`;
    }
    async uploadFile(file, description = '', tags = '', uploadedById) {
        // Create upload directory
        const uploadDir = (0, path_1.join)(process.cwd(), "public", "uploads");
        await (0, promises_1.mkdir)(uploadDir, { recursive: true });
        // Generate unique filename
        const filename = this.generateFilename(file.originalname);
        const filepath = (0, path_1.join)(uploadDir, filename);
        // Write file
        await (0, promises_1.writeFile)(filepath, file.buffer);
        // Create asset record
        const asset = await prisma_1.prisma.asset.create({
            data: {
                filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                type: this.getAssetType(file.mimetype),
                url: `/uploads/${filename}`,
                description,
                tags,
                uploadedById,
            },
        });
        return {
            id: asset.id,
            filename: asset.filename,
            originalName: asset.originalName,
            url: asset.url,
            type: asset.type,
            size: asset.size
        };
    }
    async uploadMultipleFiles(files, uploadedById) {
        const results = [];
        for (const file of files) {
            const result = await this.uploadFile(file, '', '', uploadedById);
            results.push(result);
        }
        return { files: results };
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map