"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class S3Service {
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.S3_REGION || 'us-east-1',
            endpoint: process.env.S3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_KEY,
            },
            forcePathStyle: true, // Required for MinIO
        });
        this.bucket = process.env.S3_BUCKET;
        this.localUploadPath = path_1.default.join(process.cwd(), 'uploads');
        // Ensure local upload directory exists
        if (!fs_1.default.existsSync(this.localUploadPath)) {
            fs_1.default.mkdirSync(this.localUploadPath, { recursive: true });
        }
    }
    async uploadFile(file, folder = 'uploads') {
        const fileName = `${folder}/${file.originalname}`;
        try {
            // Try S3 upload first
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3Client.send(command);
            // Return the public URL
            return `${process.env.S3_ENDPOINT}/${this.bucket}/${fileName}`;
        }
        catch (error) {
            console.warn('S3 upload failed, falling back to local storage:', error);
            // Fallback to local storage
            const localFolderPath = path_1.default.join(this.localUploadPath, folder);
            if (!fs_1.default.existsSync(localFolderPath)) {
                fs_1.default.mkdirSync(localFolderPath, { recursive: true });
            }
            const localFilePath = path_1.default.join(localFolderPath, file.originalname);
            fs_1.default.writeFileSync(localFilePath, file.buffer);
            // Return local URL
            return `/uploads/${folder}/${file.originalname}`;
        }
    }
}
exports.s3Service = new S3Service();
//# sourceMappingURL=s3.service.js.map