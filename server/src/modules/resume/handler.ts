import multer from "multer";
import type { Application, NextFunction, Request, Response } from "express";
import { ROUTES } from "../../constants/routes.js";
import { ERROR_MESSAGES } from "../../constants/error.js";
import { authMiddleware } from "../../middleware/auth.js";
import { resumeController } from "./controller.js";
import { resumeUpload } from "./upload.js";

const wrapAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export const resumeHandler = (app: Application) => {
  app.get(
    ROUTES.RESUME.RESUME,
    authMiddleware,
    wrapAsync(resumeController.getAllResumes),
  );

  app.get(
    ROUTES.RESUME.RESUME_BY_ID,
    authMiddleware,
    wrapAsync(resumeController.getResumeById),
  );

  app.post(
    ROUTES.RESUME.RESUME_PARSE,
    authMiddleware,
    wrapAsync(resumeController.parseResume),
  );

  app.put(
    ROUTES.RESUME.RESUME_PARSED_DATA,
    authMiddleware,
    wrapAsync(resumeController.updateParsedData),
  );

  app.post(
    ROUTES.RESUME.RESUME,
    authMiddleware,
    resumeUpload.single("file"),
    (error: unknown, _req: Request, res: Response, next: NextFunction) => {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: error.message });
      }

      if (error instanceof Error) {
        return res.status(400).json({
          message: ERROR_MESSAGES.RESUME.INVALID_FILE_TYPE,
          error: error.message,
        });
      }

      next();
    },
    wrapAsync(resumeController.uploadResume),
  );
};
