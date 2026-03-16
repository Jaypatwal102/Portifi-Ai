import type { Response } from "express";
import { HTTP_STATUS } from "../../constants/app.js";
import { ERROR_MESSAGES } from "../../constants/error.js";
import { LOG_MESSAGES } from "../../constants/logger.js";
import { MESSAGES } from "../../constants/response.js";
import { finalOutputSchema } from "../../agent/schema.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";
import logger from "../../utils/logger.js";
import { resumeService } from "./services.js";

export const resumeController = {
  async parseResume(req: AuthenticatedRequest, res: Response) {
    try {
      logger.info(LOG_MESSAGES.RESUME.PARSE_REQUEST);

      const userId = req.user?.userId;
      const resumeId =
        typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      if (!resumeId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: ERROR_MESSAGES.RESUME.NOT_FOUND,
        });
      }

      const parsedResume = await resumeService.parseResume(userId, resumeId);

      if (!parsedResume) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: ERROR_MESSAGES.RESUME.NOT_FOUND,
        });
      }

      logger.info(LOG_MESSAGES.RESUME.PARSE_SUCCESS, { resumeId });

      return res.status(HTTP_STATUS.SUCCESS).json({
        message: MESSAGES.RESUME.PARSE_SUCCESS,
        data: parsedResume,
      });
    } catch (error: any) {
      logger.error(LOG_MESSAGES.RESUME.PARSE_FAILURE, error);

      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: ERROR_MESSAGES.RESUME.PARSE_FAILED,
        error: error.message,
      });
    }
  },

  async getResumeById(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const resumeId =
      typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
      });
    }

    if (!resumeId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: ERROR_MESSAGES.RESUME.NOT_FOUND,
      });
    }

    const resume = await resumeService.getResumeById(userId, resumeId);

    if (!resume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.RESUME.NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.SUCCESS).json({
      data: resume,
    });
  },

  async getAllResumes(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
      });
    }

    const resumes = await resumeService.getResumesByUserId(userId);

    return res.status(HTTP_STATUS.SUCCESS).json({
      data: resumes,
    });
  },

  async uploadResume(req: AuthenticatedRequest, res: Response) {
    try {
      logger.info(LOG_MESSAGES.RESUME.UPLOAD_REQUEST);

      const userId = req.user?.userId;
      const file = req.file;

      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
        });
      }

      if (!file) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: ERROR_MESSAGES.RESUME.NO_FILE_UPLOADED,
        });
      }

      const resume = await resumeService.createResume({ userId, file });

      logger.info(LOG_MESSAGES.RESUME.UPLOAD_SUCCESS, { resumeId: resume.id });

      return res.status(HTTP_STATUS.CREATED).json({
        message: MESSAGES.RESUME.UPLOAD_SUCCESS,
        data: resume,
      });
    } catch (error: any) {
      logger.error(LOG_MESSAGES.RESUME.UPLOAD_FAILURE, error);

      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: ERROR_MESSAGES.RESUME.UPLOAD_FAILED,
        error: error.message,
      });
    }
  },

  async updateParsedData(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const resumeId =
      typeof req.params.id === "string" ? req.params.id : req.params.id?.[0];

    if (!userId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
      });
    }

    if (!resumeId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: ERROR_MESSAGES.RESUME.NOT_FOUND,
      });
    }

    const parsedBody = finalOutputSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: parsedBody.error.issues[0]?.message ?? "Invalid resume data",
      });
    }

    const updatedResume = await resumeService.updateParsedData(
      userId,
      resumeId,
      parsedBody.data,
    );

    if (!updatedResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: ERROR_MESSAGES.RESUME.NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.SUCCESS).json({
      message: MESSAGES.RESUME.UPDATE_PARSED_DATA_SUCCESS,
      data: updatedResume,
    });
  },
};
