import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import { ERROR_MESSAGES } from "../constants/error.js";
import { getEnvValue } from "./env.js";

const cloudName = getEnvValue("CLOUDINARY_CLOUD_NAME");
const apiKey = getEnvValue("CLOUDINARY_API_KEY");
const apiSecret = getEnvValue("CLOUDINARY_API_SECRET");

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

const ensureCloudinaryConfig = () => {
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(ERROR_MESSAGES.RESUME.CLOUDINARY_CONFIG_MISSING);
  }
};

export const uploadResumeToCloudinary = (
  file: Express.Multer.File,
  userId: string,
) => {
  ensureCloudinaryConfig();

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "portifi-ai/resumes",
        resource_type: "raw",
        public_id: `${userId}-${Date.now()}`,
        use_filename: true,
        unique_filename: true,
        filename_override: file.originalname,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }

        resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

export const getSignedResumeDownloadUrl = (fileUrl: string) => {
  ensureCloudinaryConfig();

  const url = new URL(fileUrl);
  const versionSegmentIndex = url.pathname.indexOf("/upload/");

  if (versionSegmentIndex === -1) {
    throw new Error("Invalid Cloudinary resume URL");
  }

  const uploadPath = url.pathname.slice(versionSegmentIndex + "/upload/".length);
  const publicId = uploadPath.replace(/^v\d+\//, "");

  return cloudinary.url(publicId, {
    resource_type: "raw",
    type: "upload",
    secure: true,
    sign_url: true,
  });
};
