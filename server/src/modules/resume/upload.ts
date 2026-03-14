import multer from "multer";
import path from "path";
import { ERROR_MESSAGES } from "../../constants/error.js";

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowedExtension = [".pdf", ".doc", ".docx"].includes(extension);
    const isAllowedMimeType = allowedMimeTypes.has(file.mimetype);

    if (!isAllowedExtension || !isAllowedMimeType) {
      cb(new Error(ERROR_MESSAGES.RESUME.INVALID_FILE_TYPE));
      return;
    }

    cb(null, true);
  },
});
