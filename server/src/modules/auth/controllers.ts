import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../../utils/logger";
import { LOG_MESSAGES } from "../../constants/logger";
import { ERROR_MESSAGES } from "../../constants/error";
import { MESSAGES } from "../../constants/response";
import { HTTP_STATUS } from "../../constants/app";
import { authService } from "./services";
import { SignupSchema, LoginSchema } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authController = {
  async signup(req: Request, res: Response) {
    try {
      const parsed = SignupSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: ERROR_MESSAGES.AUTH.VALIDATION_FAILED,
          errors: parsed.error.issues,
        });
      }

      const { name, email, password, avatarUrl } = parsed.data;

      const existingUser = await authService.findUserByEmail(email);

      if (existingUser) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: ERROR_MESSAGES.AUTH.EMAIL_EXISTS,
        });
      }

      const hashedPassword = await authService.hashPassword(password);

      const user = await authService.createUser({
        name,
        email,
        password: hashedPassword,
        avatarUrl: avatarUrl || null,
      });

      return res.status(HTTP_STATUS.CREATED).json({
        message: MESSAGES.AUTH.SIGNUP_SUCCESS,
        data: {
          userId: user.id,
          email: user.email,
        },
      });
    } catch (error: any) {
      logger.error(LOG_MESSAGES.AUTH.SIGNUP_REQUEST, error);

      if (error.code === "P2002") {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: ERROR_MESSAGES.AUTH.EMAIL_EXISTS,
        });
      }

      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: ERROR_MESSAGES.AUTH.SIGNUP_FAILED,
        error: error.message,
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const parsed = LoginSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: ERROR_MESSAGES.AUTH.VALIDATION_FAILED,
          errors: parsed.error.issues,
        });
      }

      const { email, password } = parsed.data;

      const user = await authService.findUserByEmail(email);

      if (!user) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
        });
      }

      const isValid = await authService.comparePassword(
        password,
        user.password,
      );

      if (!isValid) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: ERROR_MESSAGES.AUTH.INVALID_PASSWORD,
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.status(HTTP_STATUS.SUCCESS).json({
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error: any) {
      logger.error(LOG_MESSAGES.AUTH.LOGIN_REQUEST, error);

      return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
        message: ERROR_MESSAGES.AUTH.LOGIN_FAILED,
        error: error.message,
      });
    }
  },
};
