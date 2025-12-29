declare class S3Service {
    private s3Client;
    private bucket;
    private localUploadPath;
    constructor();
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
}
export declare const s3Service: S3Service;
export {};
//# sourceMappingURL=s3.service.d.ts.map