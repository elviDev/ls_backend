import { prisma } from "../../../lib/prisma";
import { AssetDto, AssetQueryDto } from "../dto/asset.dto";
import { cloudinaryService } from "../../../services/cloudinary.service";
import { Prisma } from "@prisma/client";

export class AssetService {
  async getAssets(query: AssetQueryDto, userId: string) {
    const { type, limit = 20, search } = query;
    
    const where: any = { uploadedById: userId };
    
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { originalName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { contains: search, mode: "insensitive" } }
      ];
    }

    const assets = await prisma.asset.findMany({
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

  async getAssetById(id: string, userId: string) {
    const asset = await prisma.asset.findUnique({
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

  async createAsset(file: Express.Multer.File, uploadedById: string, metadata?: { type?: string; description?: string; tags?: string }) {
    // Upload file to Cloudinary
    const fileUrl = await cloudinaryService.uploadFile(file, 'radio-assets');
    
    const asset = await prisma.asset.create({
      data: {
        originalName: file.originalname,
        filename: file.originalname,
        url: fileUrl,
        size: file.size,
        mimeType: file.mimetype,
        type: (metadata?.type || (file.mimetype.startsWith('image/') ? 'IMAGE' : 
              file.mimetype.startsWith('audio/') ? 'AUDIO' : 
              file.mimetype.startsWith('video/') ? 'VIDEO' : 'DOCUMENT')) as any,
        description: metadata?.description,
        tags: metadata?.tags,
        uploadedById
      }
    });

    return asset;
  }

  async updateAsset(id: string, assetData: Prisma.AssetUpdateInput, userId: string) {
    const asset = await prisma.asset.findUnique({
      where: { id },
      select: { uploadedById: true }
    });

    if (!asset) {
      throw { statusCode: 404, message: "Asset not found" };
    }

    if (asset.uploadedById !== userId) {
      throw { statusCode: 403, message: "Not authorized" };
    }

    return await prisma.asset.update({
      where: { id },
      data: assetData
    });
  }

  async deleteAsset(id: string, userId: string) {
    const asset = await prisma.asset.findUnique({
      where: { id },
      select: { uploadedById: true }
    });

    if (!asset) {
      throw { statusCode: 404, message: "Asset not found" };
    }

    if (asset.uploadedById !== userId) {
      throw { statusCode: 403, message: "Not authorized" };
    }

    await prisma.asset.delete({ where: { id } });
    return { message: "Asset deleted successfully" };
  }

  async uploadMultipleFiles(files: Express.Multer.File[], uploadedById: string) {
    const results = [];
    
    for (const file of files) {
      const result = await this.createAsset(file, uploadedById);
      results.push(result);
    }

    return { files: results };
  }
}