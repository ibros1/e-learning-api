import { v2 as cloudinary } from "cloudinary";

import multer from "multer";
import { Request } from "express";
import CloudinaryStorage from "multer-storage-cloudinary";
import { AuthRequest } from "../../types/request";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Type for Cloudinary Storage Options
interface CloudinaryStorageOptions {
  cloudinary: any;
  params: (
    req: Request,
    file: Express.Multer.File
  ) => {
    folder: string;
    public_id: string;
    allowed_formats: string[];
    transformation: any[];
  };
}

// User upload configuration
const userStorage = new (CloudinaryStorage as any)({
  cloudinary: cloudinary,
  params: (req: AuthRequest, file: Express.Multer.File) => ({
    folder: "e-learning/users",
    public_id: `user-${req.userId || "temp"}-${file.fieldname}-${Date.now()}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, crop: "fill", gravity: "face" }],
  }),
} as CloudinaryStorageOptions);

// Course upload configuration
const courseStorage = new (CloudinaryStorage as any)({
  cloudinary: cloudinary,
  params: (req: Request, file: Express.Multer.File) => ({
    folder: "e-learning/courses",
    public_id: `course-${Date.now()}-${file.fieldname}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 450, crop: "fill", quality: "auto" },
    ],
  }),
} as CloudinaryStorageOptions);

// Common multer configuration
const createUploadMiddleware = (storage: any) =>
  multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed!"));
      }
    },
  });

// Export specific upload middlewares
export const userUpload = createUploadMiddleware(userStorage);
export const courseUpload = createUploadMiddleware(courseStorage);

// Helper to delete files from Cloudinary
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

// Helper to extract public_id from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
  if (!url) return null;
  const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : null;
};
