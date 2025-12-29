export interface AssetDto {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    type: string;
    url: string;
    description?: string;
    tags?: string;
}
export interface AssetQueryDto {
    type?: string;
    limit?: number;
    search?: string;
}
//# sourceMappingURL=asset.dto.d.ts.map