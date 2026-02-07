import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import cors from "cors";
import { initRoutes } from "./routes/index";
const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "",
  });
});

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to HYREHR API v1" });
});

initRoutes(app);

export default app;
