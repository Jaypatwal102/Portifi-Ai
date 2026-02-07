import type { Application, Request, Response, NextFunction } from "express";
import { ROUTES } from "../../constants/routes";
import { authController } from "./controllers";
const wrapAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export const authRoutes = (app: Application) => {
  app.post(ROUTES.AUTH.LOGIN, wrapAsync(authController.login));

  app.get(ROUTES.AUTH.SIGNUP, wrapAsync(authController.signup));
};
