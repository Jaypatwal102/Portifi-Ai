import { Prisma, ResumeStatus } from "../../../generated/prisma/client.js";
import { prisma } from "../../../lib/prisma.js";

interface CreateResumeDTO {
  userId: string;
  fileUrl: string;
  fileType: string;
  fileHash: string;
  status: ResumeStatus;
}

export const resumeDao = {
  async createResume(data: CreateResumeDTO) {
    return prisma.resume.create({
      data,
      select: {
        id: true,
        userId: true,
        fileUrl: true,
        fileType: true,
        fileHash: true,
        status: true,
        uploadedAt: true,
      },
    });
  },

  async findResumesByUserId(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        fileUrl: true,
        fileType: true,
        fileHash: true,
        status: true,
        uploadedAt: true,
      },
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
      select: {
        id: true,
        userId: true,
        fileUrl: true,
        fileType: true,
        fileHash: true,
        status: true,
        uploadedAt: true,
      },
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
    parsedData: {
      basics: Prisma.InputJsonValue;
      skills: Prisma.InputJsonValue;
      experience: Prisma.InputJsonValue;
      education: Prisma.InputJsonValue;
      projects: Prisma.InputJsonValue;
      socials: Prisma.InputJsonValue;
    },
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
};
