import { Application } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { Request, Response } from "express";

export const resumeHandler = (app: Application) => {
  app.post("/resume", authMiddleware, async (req: Request, res: Response) => {
    // Handler logic for resume generation
  });
};
