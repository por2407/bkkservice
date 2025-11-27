import { Router } from "express";
import { taskRouter } from "./task/task.routes.js";

export const apiRouter = Router();

apiRouter.use("/tasks", taskRouter);
