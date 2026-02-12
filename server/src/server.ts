import "dotenv/config";
import http from "http";
import app from "./app.js";
import { setupSwagger } from "./swagger.js";

const PORT = process.env.PORT || 5500;
const server = http.createServer(app);
setupSwagger(app);
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
