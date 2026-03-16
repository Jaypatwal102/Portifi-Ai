import { Prisma, ResumeStatus } from "../../../generated/prisma/client.js";
import { prisma } from "../../../lib/prisma.js";

interface CreateResumeDTO {
  userId: string;
  fileUrl: string;
  fileType: string;
  fileHash: string;
  status: ResumeStatus;
}

interface ParsedDataDTO {
  basics: Prisma.InputJsonValue;
  skills: Prisma.InputJsonValue;
  experience: Prisma.InputJsonValue;
  education: Prisma.InputJsonValue;
  projects: Prisma.InputJsonValue;
  socials: Prisma.InputJsonValue;
}

interface ReplaceResumeDTO {
  id: string;
  userId: string;
  fileUrl: string;
  fileType: string;
  fileHash: string;
}

const resumeSelect = {
  id: true,
  userId: true,
  fileUrl: true,
  fileType: true,
  fileHash: true,
  status: true,
  uploadedAt: true,
  parsedData: {
    select: {
      id: true,
      resumeId: true,
      basics: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      socials: true,
      updatedAt: true,
    },
  },
} as const;

export const resumeDao = {
  async createResume(data: CreateResumeDTO) {
    return prisma.resume.create({
      data,
      select: resumeSelect,
    });
  },

  async findResumesByUserId(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      select: resumeSelect,
      orderBy: {
        uploadedAt: "desc",
      },
    });
  },

  async findResumeByIdAndUserId(id: string, userId: string) {
    return prisma.resume.findFirst({
      where: {
        id,
        userId,
      },
      select: resumeSelect,
    });
  },

  async updateResumeStatus(id: string, status: ResumeStatus) {
    return prisma.resume.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
      },
    });
  },

  async upsertParsedData(
    resumeId: string,
    parsedData: ParsedDataDTO,
  ) {
    return prisma.resumeParsedData.upsert({
      where: { resumeId },
      update: parsedData,
      create: {
        resumeId,
        ...parsedData,
      },
      select: {
        id: true,
        resumeId: true,
        basics: true,
        skills: true,
        experience: true,
        education: true,
        projects: true,
        socials: true,
        updatedAt: true,
      },
    });
  },

  async updateParsedData(
    resumeId: string,
    parsedData: ParsedDataDTO,
  ) {
    return prisma.resumeParsedData.update({
      where: { resumeId },
      data: parsedData,
      select: {
        id: true,
        resumeId: true,
        basics: true,
        skills: true,
        experience: true,
        education: true,
        projects: true,
        socials: true,
        updatedAt: true,
      },
    });
  },

  async deleteResumeByIdAndUserId(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.resumeParsedData.deleteMany({
        where: { resumeId: id },
      });

      const deleted = await tx.resume.deleteMany({
        where: { id, userId },
      });

      return deleted.count;
    });
  },

  async replaceResume(data: ReplaceResumeDTO) {
    return prisma.$transaction(async (tx) => {
      await tx.resumeParsedData.deleteMany({
        where: { resumeId: data.id },
      });

      const updated = await tx.resume.updateMany({
        where: {
          id: data.id,
          userId: data.userId,
        },
        data: {
          fileUrl: data.fileUrl,
          fileType: data.fileType,
          fileHash: data.fileHash,
          status: ResumeStatus.UPLOADED,
          uploadedAt: new Date(),
        },
      });

      if (updated.count === 0) {
        return null;
      }

      return tx.resume.findFirst({
        where: {
          id: data.id,
          userId: data.userId,
        },
        select: resumeSelect,
      });
    });
  },
};
