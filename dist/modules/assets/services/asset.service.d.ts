import { AssetQueryDto } from "../dto/asset.dto";
import { Prisma } from "@prisma/client";
export declare class AssetService {
    getAssets(query: AssetQueryDto, userId: string): Promise<{
        assets: ({
            uploadedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.AssetType;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            url: string;
            description: string | null;
            tags: string | null;
            uploadedById: string;
        })[];
    }>;
    getAssetById(id: string, userId: string): Promise<{
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.AssetType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        description: string | null;
        tags: string | null;
        uploadedById: string;
    }>;
    createAsset(file: Express.Multer.File, uploadedById: string, metadata?: {
        type?: string;
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.AssetType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        description: string | null;
        tags: string | null;
        uploadedById: string;
    }>;
    updateAsset(id: string, assetData: Prisma.AssetUpdateInput, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.AssetType;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        description: string | null;
        tags: string | null;
        uploadedById: string;
    }>;
    deleteAsset(id: string, userId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=asset.service.d.ts.map