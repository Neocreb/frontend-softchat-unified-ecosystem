import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import sharp from "sharp";

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "softchat-uploads";

// File type validation
const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
const allowedDocumentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// File size limits (in bytes)
const limits = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  document: 50 * 1024 * 1024, // 50MB
  avatar: 5 * 1024 * 1024, // 5MB
};

// Multer configuration
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    const isValidType = [
      ...allowedImageTypes,
      ...allowedVideoTypes,
      ...allowedDocumentTypes,
    ].includes(file.mimetype);

    if (isValidType) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
  },
});

// Generate unique filename
const generateFileName = (originalName: string): string => {
  const ext = path.extname(originalName);
  return `${uuidv4()}${ext}`;
};

// Upload to S3
const uploadToS3 = async (
  buffer: Buffer,
  fileName: string,
  contentType: string,
  folder: string = "uploads",
): Promise<string> => {
  const key = `${folder}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "max-age=31536000", // 1 year
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

// Image processing with Sharp
const processImage = async (
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "jpeg" | "png" | "webp";
  } = {},
): Promise<Buffer> => {
  const { width, height, quality = 85, format = "jpeg" } = options;

  let processor = sharp(buffer);

  if (width || height) {
    processor = processor.resize(width, height, {
      fit: "cover",
      position: "center",
    });
  }

  switch (format) {
    case "jpeg":
      processor = processor.jpeg({ quality });
      break;
    case "png":
      processor = processor.png({ quality });
      break;
    case "webp":
      processor = processor.webp({ quality });
      break;
  }

  return processor.toBuffer();
};

// Generate image variants
const generateImageVariants = async (
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<{
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}> => {
  const baseFileName = fileName.replace(path.extname(fileName), "");
  const ext = ".webp"; // Use WebP for better compression

  // Generate variants
  const [originalProcessed, thumbnail, medium, large] = await Promise.all([
    processImage(buffer, { quality: 90, format: "webp" }),
    processImage(buffer, {
      width: 150,
      height: 150,
      quality: 80,
      format: "webp",
    }),
    processImage(buffer, {
      width: 500,
      height: 500,
      quality: 85,
      format: "webp",
    }),
    processImage(buffer, {
      width: 1200,
      height: 1200,
      quality: 90,
      format: "webp",
    }),
  ]);

  // Upload all variants
  const [originalUrl, thumbnailUrl, mediumUrl, largeUrl] = await Promise.all([
    uploadToS3(
      originalProcessed,
      `${baseFileName}_original${ext}`,
      "image/webp",
      "images",
    ),
    uploadToS3(
      thumbnail,
      `${baseFileName}_thumbnail${ext}`,
      "image/webp",
      "images",
    ),
    uploadToS3(medium, `${baseFileName}_medium${ext}`, "image/webp", "images"),
    uploadToS3(large, `${baseFileName}_large${ext}`, "image/webp", "images"),
  ]);

  return {
    original: originalUrl,
    thumbnail: thumbnailUrl,
    medium: mediumUrl,
    large: largeUrl,
  };
};

// File service interface
export interface UploadResult {
  id: string;
  originalName: string;
  fileName: string;
  url: string;
  variants?: {
    original: string;
    thumbnail: string;
    medium: string;
    large: string;
  };
  size: number;
  mimeType: string;
  folder: string;
}

export class FileService {
  // Upload single file
  static async uploadFile(
    file: Express.Multer.File,
    folder: string = "uploads",
    generateVariants: boolean = false,
  ): Promise<UploadResult> {
    const fileName = generateFileName(file.originalname);
    const fileId = uuidv4();

    try {
      if (generateVariants && allowedImageTypes.includes(file.mimetype)) {
        // Generate image variants
        const variants = await generateImageVariants(
          file.buffer,
          fileName,
          file.mimetype,
        );

        return {
          id: fileId,
          originalName: file.originalname,
          fileName,
          url: variants.original,
          variants,
          size: file.size,
          mimeType: file.mimetype,
          folder,
        };
      } else {
        // Upload single file
        const url = await uploadToS3(
          file.buffer,
          fileName,
          file.mimetype,
          folder,
        );

        return {
          id: fileId,
          originalName: file.originalname,
          fileName,
          url,
          size: file.size,
          mimeType: file.mimetype,
          folder,
        };
      }
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error("Failed to upload file");
    }
  }

  // Upload multiple files
  static async uploadFiles(
    files: Express.Multer.File[],
    folder: string = "uploads",
    generateVariants: boolean = false,
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, folder, generateVariants),
    );

    return Promise.all(uploadPromises);
  }

  // Upload avatar with processing
  static async uploadAvatar(file: Express.Multer.File): Promise<UploadResult> {
    if (!allowedImageTypes.includes(file.mimetype)) {
      throw new Error("Invalid file type for avatar");
    }

    if (file.size > limits.avatar) {
      throw new Error("Avatar file too large");
    }

    return this.uploadFile(file, "avatars", true);
  }

  // Upload post media
  static async uploadPostMedia(
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    const isImage = allowedImageTypes.includes(file.mimetype);
    const isVideo = allowedVideoTypes.includes(file.mimetype);

    if (!isImage && !isVideo) {
      throw new Error("Invalid file type for post media");
    }

    const maxSize = isImage ? limits.image : limits.video;
    if (file.size > maxSize) {
      throw new Error("File too large");
    }

    const folder = isImage ? "posts/images" : "posts/videos";
    return this.uploadFile(file, folder, isImage);
  }

  // Upload product images
  static async uploadProductImages(
    files: Express.Multer.File[],
  ): Promise<UploadResult[]> {
    const imageFiles = files.filter((file) =>
      allowedImageTypes.includes(file.mimetype),
    );

    if (imageFiles.length === 0) {
      throw new Error("No valid image files provided");
    }

    for (const file of imageFiles) {
      if (file.size > limits.image) {
        throw new Error(`Image ${file.originalname} is too large`);
      }
    }

    return this.uploadFiles(imageFiles, "products", true);
  }

  // Upload freelance project files
  static async uploadProjectFiles(
    files: Express.Multer.File[],
  ): Promise<UploadResult[]> {
    for (const file of files) {
      const isValid = [...allowedImageTypes, ...allowedDocumentTypes].includes(
        file.mimetype,
      );

      if (!isValid) {
        throw new Error(`Invalid file type: ${file.mimetype}`);
      }

      const maxSize = allowedImageTypes.includes(file.mimetype)
        ? limits.image
        : limits.document;
      if (file.size > maxSize) {
        throw new Error(`File ${file.originalname} is too large`);
      }
    }

    return this.uploadFiles(files, "projects");
  }

  // Delete file from S3
  static async deleteFile(
    fileName: string,
    folder: string = "uploads",
  ): Promise<boolean> {
    try {
      const key = `${folder}/${fileName}`;
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      await s3Client.send(command);
      return true;
    } catch (error) {
      console.error("File deletion error:", error);
      return false;
    }
  }

  // Delete multiple files
  static async deleteFiles(
    fileNames: string[],
    folder: string = "uploads",
  ): Promise<void> {
    const deletePromises = fileNames.map((fileName) =>
      this.deleteFile(fileName, folder),
    );
    await Promise.all(deletePromises);
  }

  // Get file info
  static async getFileInfo(
    fileName: string,
    folder: string = "uploads",
  ): Promise<any> {
    try {
      const key = `${folder}/${fileName}`;
      const command = new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key });
      const result = await s3Client.send(command);
      return {
        size: result.ContentLength,
        lastModified: result.LastModified,
        contentType: result.ContentType,
        etag: result.ETag,
      };
    } catch (error) {
      console.error("File info error:", error);
      return null;
    }
  }

  // Generate presigned URL for direct uploads
  static async generatePresignedUrl(
    fileName: string,
    contentType: string,
    folder: string = "uploads",
    expiresIn: number = 3600,
  ): Promise<string> {
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  // Validate file type and size
  static validateFile(
    file: Express.Multer.File,
    type: "image" | "video" | "document" | "avatar",
  ): boolean {
    let allowedTypes: string[];
    let maxSize: number;

    switch (type) {
      case "image":
        allowedTypes = allowedImageTypes;
        maxSize = limits.image;
        break;
      case "video":
        allowedTypes = allowedVideoTypes;
        maxSize = limits.video;
        break;
      case "document":
        allowedTypes = allowedDocumentTypes;
        maxSize = limits.document;
        break;
      case "avatar":
        allowedTypes = allowedImageTypes;
        maxSize = limits.avatar;
        break;
      default:
        return false;
    }

    return allowedTypes.includes(file.mimetype) && file.size <= maxSize;
  }
}

// Export multer middleware for different upload types
export const uploadMiddleware = {
  single: (fieldName: string) => upload.single(fieldName),
  multiple: (fieldName: string, maxCount: number = 10) =>
    upload.array(fieldName, maxCount),
  fields: (fields: { name: string; maxCount?: number }[]) =>
    upload.fields(fields),
  avatar: upload.single("avatar"),
  postMedia: upload.single("media"),
  productImages: upload.array("images", 10),
  projectFiles: upload.array("files", 20),
};
