import express from "express";
import { type Application } from "express";
import { authRoutes } from "../modules/auth/handler";
import { API_VERSION } from "../constants/routes";
const initV1Routes = (): express.Router => {
  const router = express.Router();
  const routerAsApp = router as Application;
  authRoutes(routerAsApp);
  return router;
};

export const initRoutes = (app: Application): void => {
  const v1Router = initV1Routes();
  app.use(API_VERSION.V1, v1Router);
};
