import express from "express";
import cors from "cors"
import { apiRouter } from "./api/routes.js";
import { corsOptions } from "./config/corsOption.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors(corsOptions));

  app.use("/api", apiRouter);
  app.get("/test", (req, res) => res.status(200).json({ message: "ok" }));

  return app;
}
