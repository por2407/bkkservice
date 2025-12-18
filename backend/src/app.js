import express from "express";
import cors from "cors";
import { apiRouter } from "./api/routes.js";
import { corsOptions } from "./config/corsOption.js";
import { imageUploadDir, commentImageDir } from "./config/upload.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors(corsOptions));

  app.use("/img_service", express.static(imageUploadDir));
  app.use("/media_comments", express.static(commentImageDir));

  app.use("/api", apiRouter);
  app.get("/test", (req, res) => res.status(200).json({ message: "ok" }));

  app.use(errorHandler);

  return app;
}
