"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const crypto_1 = __importDefault(require("crypto"));
class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    generateFileHash(buffer) {
        return crypto_1.default.createHash('md5').update(buffer).digest('hex');
    }
    async uploadFile(file, folder = 'assets') {
        const fileHash = this.generateFileHash(file.buffer);
        const publicId = `${folder}/${fileHash}`;
        try {
            // Check if file already exists
            const existingFile = await cloudinary_1.v2.api.resource(publicId);
            if (existingFile) {
                return existingFile.secure_url;
            }
        }
        catch (error) {
            // File doesn't exist, proceed with upload
        }
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({
                resource_type: 'auto',
                public_id: publicId,
                use_filename: false,
                unique_filename: false,
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result.secure_url);
                }
            }).end(file.buffer);
        });
    }
    async deleteFile(publicId) {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
}
exports.cloudinaryService = new CloudinaryService();
//# sourceMappingURL=cloudinary.service.js.map