"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const prisma_1 = require("../../../lib/prisma");
const cloudinary_service_1 = require("../../../services/cloudinary.service");
class AssetService {
    async getAssets(query, userId) {
        const { type, limit = 20, search } = query;
        const where = { uploadedById: userId };
        if (type)
            where.type = type;
        if (search) {
            where.OR = [
                { originalName: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { tags: { contains: search, mode: "insensitive" } }
            ];
        }
        const assets = await prisma_1.prisma.asset.findMany({
            where,
            include: {
                uploadedBy: {
                    select: { id: true, firstName: true, lastName: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return { assets };
    }
    async getAssetById(id, userId) {
        const asset = await prisma_1.prisma.asset.findUnique({
            where: { id },
            include: {
                uploadedBy: {
                    select: { id: true, firstName: true, lastName: true }
                }
            }
        });
        if (!asset) {
            throw { statusCode: 404, message: "Asset not found" };
        }
        if (asset.uploadedById !== userId) {
            throw { statusCode: 403, message: "Not authorized" };
        }
        return asset;
    }
    async createAsset(file, uploadedById, metadata) {
        // Upload file to Cloudinary
        const fileUrl = await cloudinary_service_1.cloudinaryService.uploadFile(file, 'radio-assets');
        const asset = await prisma_1.prisma.asset.create({
            data: {
                originalName: file.originalname,
                filename: file.originalname,
                url: fileUrl,
                size: file.size,
                mimeType: file.mimetype,
                type: (metadata?.type || (file.mimetype.startsWith('image/') ? 'IMAGE' :
                    file.mimetype.startsWith('audio/') ? 'AUDIO' :
                        file.mimetype.startsWith('video/') ? 'VIDEO' : 'DOCUMENT')),
                description: metadata?.description,
                tags: metadata?.tags,
                uploadedById
            }
        });
        return asset;
    }
    async updateAsset(id, assetData, userId) {
        const asset = await prisma_1.prisma.asset.findUnique({
            where: { id },
            select: { uploadedById: true }
        });
        if (!asset) {
            throw { statusCode: 404, message: "Asset not found" };
        }
        if (asset.uploadedById !== userId) {
            throw { statusCode: 403, message: "Not authorized" };
        }
        return await prisma_1.prisma.asset.update({
            where: { id },
            data: assetData
        });
    }
    async deleteAsset(id, userId) {
        const asset = await prisma_1.prisma.asset.findUnique({
            where: { id },
            select: { uploadedById: true }
        });
        if (!asset) {
            throw { statusCode: 404, message: "Asset not found" };
        }
        if (asset.uploadedById !== userId) {
            throw { statusCode: 403, message: "Not authorized" };
        }
        await prisma_1.prisma.asset.delete({ where: { id } });
        return { message: "Asset deleted successfully" };
    }
    async uploadMultipleFiles(files, uploadedById) {
        const results = [];
        for (const file of files) {
            const result = await this.createAsset(file, uploadedById);
            results.push(result);
        }
        return { files: results };
    }
}
exports.AssetService = AssetService;
//# sourceMappingURL=asset.service.js.map