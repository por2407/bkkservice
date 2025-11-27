import { Router } from "express";
export const taskRouter = Router();
import { taskService } from "./task.service.js";

taskRouter.get("/list", async (req, res, next) => {
  try {
    const { userCode, custSeq, userType } = req.query;
    const result = await taskService.taskStatuses({
      userCode,
      custSeq,
      userType,
    });
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});
