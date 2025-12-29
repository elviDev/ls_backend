export interface UploadDto {
    file: File;
    description?: string;
    tags?: string;
}
export interface UploadResponse {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    type: string;
    size: number;
}
//# sourceMappingURL=upload.dto.d.ts.map