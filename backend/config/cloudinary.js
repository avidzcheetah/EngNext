import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === 'application/pdf';
    // Strip extension and sanitize the original filename for use as public_id
    const originalName = file.originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();

    return {
      folder: 'engnext_uploads',
      // PDFs must use 'raw' resource type so Cloudinary serves them correctly
      resource_type: isPDF ? 'raw' : 'image',
      allowed_formats: isPDF ? ['pdf'] : ['jpg', 'png', 'jpeg'],
      // Use original filename + timestamp to keep it readable and unique (do not append .pdf here to avoid Cloudinary strict delivery 401 errors)
      public_id: `${originalName}_${timestamp}`,
    };
  },
});

export default cloudinary;
