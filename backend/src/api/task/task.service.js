import { withTransaction, withConnect } from "../../shared/db/transaction.js";
import { taskModel } from "./task.model.js";

export const taskService = {
  taskStatuses,
  taskDetail,
  newTask,
  taskTimeLine,
};

const LIST_TASK_BY_TYPE = {
  c: (ctx) => taskModel.customer.findCustomerInprogress(ctx),
  e: (ctx) => taskModel.employee.findEmployeeInprogress(ctx),
  d: (ctx) => taskModel.dealer.findDealerInprogress(ctx),
};
async function taskStatuses(ctx) {
  const { userType } = ctx;
  const handler = LIST_TASK_BY_TYPE[userType];
  if (!handler) {
    throw new Error(`Unknown user type: ${userType}`);
  }
  return withConnect(async (conn) => {
    const { rows } = await handler({ conn, ...ctx });
    const tasks = [];

    for (const row of rows) {
      const files = (row.STT_IMAGE || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const hasImage = files.some((name) => {
        const lower = name.toLowerCase();
        return (
          lower.endsWith(".jpg") ||
          lower.endsWith(".jpeg") ||
          lower.endsWith(".png")
        );
      });

      const hasVideo = files.some((name) => {
        const lower = name.toLowerCase();
        return lower.endsWith(".mov") || lower.endsWith(".mp4");
      });

      const media = files.map((name) => {
        const lower = name.toLowerCase();
        const isImage =
          lower.endsWith(".jpg") ||
          lower.endsWith(".jpeg") ||
          lower.endsWith(".png");

        return {
          type: isImage ? "image" : "video",
          url: `http://localhost:3001/img_service/${name}`,
        };
      });

      const canRate =
        row.STT_STATUS === "Y" &&
        (userType === "c" ? row.CANRATING === 1 : true);
      const data = {
        id: row.STT_JOBNO ?? row.JOB_NO,
        ...(row.ORDERING ? { isMine: row.ORDERING === 1 } : {}),
        ...(row.CUSTNAME ? { schoolName: row.CUSTNAME } : {}),
        ticket: row.STT_TAR_NO,
        room: row.STT_ROOM_NO,
        description: row.STT_DET,
        status: row.STATUS,
        updatedAt: row.STT_DATE,
        commentsCount: 3,
        canRate,
        rating: row.BTDST_SCORE ?? null,
        dueDate: row.SSMT_ENDJOB_DATE ?? null,
        hasImage,
        hasVideo,
        media,
        ...(userType === "d" && row.END_SV_DATE
          ? { endsv_job: row.END_SV_DATE }
          : {}),
        ...(userType === "d" && row.EXHIBITION_48
          ? { eduExh48: row.EXHIBITION_48 }
          : {}),
        currentStep: row.SSMT_TYPE_SEQ
          ? Math.min(Number(row.SSMT_TYPE_SEQ) + 1, 5)
          : 1,
      };
      tasks.push(data);
    }
    return tasks;
  });
}

async function taskDetail({ tarNo, userType }) {
  const type = userType !== "e";
  return withConnect(async (conn) => {
    const { rows } = await taskModel.findDetail({ conn, tarNo, type });
    let data;
    for (const row of rows) {
      const { rows: timelineRows } = await taskModel.timeLine({
        conn,
        JobNo: row.STT_JOBNO,
      });
      const timeline = [];
      for (const tl of timelineRows) {
        timeline.push({
          code: tl.SSMT_TYPE_CODE,
          step: tl.SSMT_TYPE_SEQ,
          label: tl.SSSR_DESC,
          ...(tl.SSMT_STATUS === "Y"
            ? {}
            : {
                dueAt: tl.SSMT_ENDJOB_DATE,
                ...(!type ? { empCode: tl.SSMT_EMPCODE } : {}),
              }),
          ...(tl.SSMT_DATE_ST && tl.SSMT_DATE_ED
            ? { finishedAt: tl.SSMT_DATE_ED, operator: tl.EMP_NAME }
            : {}),
        });
      }

      const doneCount = timelineRows.filter(
        (i) => i.SSMT_DATE_ST && i.SSMT_DATE_ED
      ).length;

      const currentStep = Math.min(doneCount + 1, timelineRows.length);
      const isSubmit = !type ? !!row.BTDST_SUBMIT_DATE : undefined;

      const files = (row.STT_IMAGE || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const media = files.map((name) => {
        const lower = name.toLowerCase();
        const isImage =
          lower.endsWith(".jpg") ||
          lower.endsWith(".jpeg") ||
          lower.endsWith(".png");

        return {
          type: isImage ? "image" : "video",
          url: `http://localhost:3001/img_service/${name}`,
        };
      });

      data = {
        id: row.STT_JOBNO,
        ticket: row.STT_TAR_NO,
        room: row.STT_ROOM_NO,
        description: row.STT_DET,
        status: row.STATUS,
        updatedAt: row.STT_DATE,
        currentStep,
        media,
        timeline,
        isSubmit,
      };
    }
    return data;
  });
}

async function taskTimeLine({ tarNo, userType }) {
  const type = userType !== "e";
  return withConnect(async (conn) => {
    const timeline = [];
    const { rows } = await taskModel.getPartialInfo({ conn, tarNo, type });
    const JobNo = rows?.[0]?.STT_JOBNO;
    const isSubmit = !type ? !!rows?.[0]?.BTDST_SUBMIT_DATE : undefined;
    if (!JobNo)
      return {
        timeline,
        isSubmit,
      };
    const { rows: timelineRows } = await taskModel.timeLine({
      conn,
      JobNo,
    });
    for (const tl of timelineRows) {
      timeline.push({
        code: tl.SSMT_TYPE_CODE,
        step: tl.SSMT_TYPE_SEQ,
        label: tl.SSSR_DESC,
        ...(tl.SSMT_STATUS === "Y"
          ? {}
          : {
              dueAt: tl.SSMT_ENDJOB_DATE,
              ...(!type ? { empCode: tl.SSMT_EMPCODE } : {}),
            }),
        ...(tl.SSMT_DATE_ST && tl.SSMT_DATE_ED
          ? { finishedAt: tl.SSMT_DATE_ED, operator: tl.EMP_NAME }
          : {}),
      });
    }

    return {
      timeline,
      isSubmit,
    };
  });
}

async function newTask({ data }) {
  return withTransaction(
    async (conn) =>
      await taskModel.customer.createNewTask({ conn, payload: data })
  );
}
