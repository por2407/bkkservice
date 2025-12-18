import { Router } from "express";
import { taskRouter } from "./task/task.routes.js";
import { certsRouter } from "./certificates/certificates.routes.js";

export const apiRouter = Router();

apiRouter.use("/tasks", taskRouter);
apiRouter.use("/certificates", certsRouter);