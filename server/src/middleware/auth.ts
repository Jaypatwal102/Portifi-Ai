import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../constants/app.js";
import { ERROR_MESSAGES } from "../constants/error.js";
import logger from "../utils/logger.js";
import { LOG_MESSAGES } from "../constants/logger.js";
import { getJwtSecret } from "../utils/env.js";

const JWT_SECRET = getJwtSecret();

interface AuthTokenPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: ERROR_MESSAGES.AUTH.UNAUTHORIZED,
    });
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      logger.warn(LOG_MESSAGES.AUTH.INVALID_TOKEN);

      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.AUTH.TOKEN_INVALID,
      });
    }

    req.user = decoded as AuthTokenPayload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn(LOG_MESSAGES.AUTH.TOKEN_EXPIRED);

      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
      });
    }

    logger.warn(LOG_MESSAGES.AUTH.INVALID_TOKEN);

    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: ERROR_MESSAGES.AUTH.TOKEN_INVALID,
    });
  }
};
