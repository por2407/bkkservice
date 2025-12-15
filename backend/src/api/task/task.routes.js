import { Router } from "express";
export const taskRouter = Router();
import { taskService } from "./task.service.js";
import { uploadImage } from "./task.storage.js";
import { getTarNo } from "../../shared/middleware/getTarNo.js";

taskRouter
  .get("/list", async (req, res, next) => {
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
  })
  .get("/detail", async (req, res, next) => {
    try {
      const { tarNo, userType } = req.query;
      const result = await taskService.taskDetail({ tarNo, userType });
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  })
  .get("/time-line", async (req, res, next) => {
    try {
      const { tarNo, userType, isCanRate } = req.query;
      const result = await taskService.taskTimeLine({
        tarNo,
        userType,
        isCanRate,
      });
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  })
  .post(
    "/create-task",
    getTarNo,
    uploadImage.array("image"),
    async (req, res, next) => {
      try {
        const files = req.files || [];
        const tarNo = req.tarNo;
        const nameFile =
          files.length > 0 ? files.map((f) => f.filename).join(",") : null;
        const data = {
          ...req.body,
          nameFile,
          tarNo,
        };
        const result = await taskService.newTask({ data });
        return res.status(200).json(result);
      } catch (e) {
        next(e);
      }
    }
  )
  .put("/update-status/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const payload = {
        ...req.body,
        typeSeq: id,
      };
      const result = await taskService.activeStatus({ payload });
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  })
  .get("/date-task", async (req, res, next) => {
    try {
      const { userCode, jobNo } = req.query;
      const result = await taskService.getTaskStartDate({ userCode, jobNo });
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  })
  .put("/update-status-finish/:id", async (req, res, next) => {
    try {
      const { id } = req.params;

      const payload = {
        ...req.body,
        typeSeq: id,
      };

      const result = await taskService.taskUpdateService({ data: payload });
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  })
  .post("/process-job-scoring-workflow", async (req, res, next) => {
    try {
      const result = await taskService.processJobScoringWorkflow({
        data: req.body,
      });
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  });
