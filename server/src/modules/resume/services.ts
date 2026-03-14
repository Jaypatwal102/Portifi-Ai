import crypto from "crypto";
import mammoth from "mammoth";
import path from "path";
import { Prisma, ResumeStatus } from "../../../generated/prisma/client.js";
import { askStructured } from "../../agent/generate_data.js";
import {
  getSignedResumeDownloadUrl,
  uploadResumeToCloudinary,
} from "../../utils/cloudinary.js";
import { resumeDao } from "./dao.js";

interface CreateResumeInput {
  userId: string;
  file: Express.Multer.File;
}

const getNormalizedFileType = (mimeType: string, originalName: string) => {
  const extension = path.extname(originalName).toLowerCase();

  if (mimeType === "application/pdf" || extension === ".pdf") {
    return "pdf";
  }

  if (mimeType === "application/msword" || extension === ".doc") {
    return "doc";
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".docx"
  ) {
    return "docx";
  }

  return extension.replace(".", "") || "unknown";
};

const calculateFileHash = (buffer: Buffer) =>
  crypto.createHash("sha256").update(buffer).digest("hex");

const extractResumeText = async (fileType: string, fileBuffer: Buffer) => {
  if (fileType === "doc" || fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value.trim();
  }

  if (fileType === "pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text.trim();
  }

  throw new Error(`Unsupported resume type: ${fileType}`);
};

export const resumeService = {
  async createResume({ userId, file }: CreateResumeInput) {
    const fileHash = calculateFileHash(file.buffer);
    const fileType = getNormalizedFileType(file.mimetype, file.originalname);
    const cloudinaryUpload = await uploadResumeToCloudinary(file, userId);

    return resumeDao.createResume({
      userId,
      fileUrl: cloudinaryUpload.secure_url,
      fileType,
      fileHash,
      status: ResumeStatus.UPLOADED,
    });
  },

  async getResumesByUserId(userId: string) {
    return resumeDao.findResumesByUserId(userId);
  },

  async getResumeById(userId: string, resumeId: string) {
    return resumeDao.findResumeByIdAndUserId(resumeId, userId);
  },

  async parseResume(userId: string, resumeId: string) {
    const resume = await resumeDao.findResumeByIdAndUserId(resumeId, userId);

    if (!resume) {
      return null;
    }

    await resumeDao.updateResumeStatus(resumeId, ResumeStatus.PARSING);

    try {
      const signedUrl = getSignedResumeDownloadUrl(resume.fileUrl);
      const response = await fetch(signedUrl);

      if (!response.ok) {
        throw new Error(`Failed to download resume file: ${response.status}`);
      }

      const fileBuffer = Buffer.from(await response.arrayBuffer());
      const resumeText = await extractResumeText(resume.fileType, fileBuffer);
      const parsed = await askStructured(resumeText);

      const parsedData = await resumeDao.upsertParsedData(resumeId, {
        basics: parsed.basics as Prisma.InputJsonValue,
        skills: parsed.skills as Prisma.InputJsonValue,
        experience: parsed.experience as Prisma.InputJsonValue,
        education: parsed.education as Prisma.InputJsonValue,
        projects: parsed.projects as Prisma.InputJsonValue,
        socials: parsed.socials as Prisma.InputJsonValue,
      });

      await resumeDao.updateResumeStatus(resumeId, ResumeStatus.PARSED);

      return {
        resumeId,
        parsedData,
      };
    } catch (error) {
      await resumeDao.updateResumeStatus(resumeId, ResumeStatus.FAILED);
      throw error;
    }
  },
};
