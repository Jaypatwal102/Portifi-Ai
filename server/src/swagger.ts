import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { Application } from "express";
import path from "path";
import { getEnvValue } from "./utils/env.js";

const swaggerDocument = YAML.load(path.resolve(process.cwd(), "docs/openApi.yaml"));
const publicApiUrl = getEnvValue("PUBLIC_API_URL");

if (publicApiUrl) {
  swaggerDocument.servers = [{ url: publicApiUrl.replace(/\/$/, "") }];
}

export function setupSwagger(app: Application) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
