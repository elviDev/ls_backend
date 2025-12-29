export declare class UploadService {
    private getAssetType;
    private generateFilename;
    uploadFile(file: any, description: string, tags: string, uploadedById: string): Promise<{
        id: string;
        filename: string;
        originalName: string;
        url: string;
        type: import(".prisma/client").$Enums.AssetType;
        size: number;
    }>;
    uploadMultipleFiles(files: any[], uploadedById: string): Promise<{
        files: any[];
    }>;
}
//# sourceMappingURL=upload.service.d.ts.map