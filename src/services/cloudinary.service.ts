import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  private generateFileHash(buffer: Buffer): string {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'assets'): Promise<string> {
    const fileHash = this.generateFileHash(file.buffer);
    const publicId = `${folder}/${fileHash}`;

    try {
      // Check if file already exists
      const existingFile = await cloudinary.api.resource(publicId);
      if (existingFile) {
        return existingFile.secure_url;
      }
    } catch (error) {
      // File doesn't exist, proceed with upload
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: publicId,
          use_filename: false,
          unique_filename: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      ).end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

export const cloudinaryService = new CloudinaryService();