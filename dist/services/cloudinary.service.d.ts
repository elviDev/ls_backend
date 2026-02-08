declare class CloudinaryService {
    constructor();
    private generateFileHash;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<string>;
    deleteFile(publicId: string): Promise<void>;
}
export declare const cloudinaryService: CloudinaryService;
export {};
//# sourceMappingURL=cloudinary.service.d.ts.map