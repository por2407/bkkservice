import { withTransaction, withConnect } from "../../shared/db/transaction.js";
import { taskModel } from "./task.model.js";

export const taskService = {
  taskStatuses,
};

const LIST_TASK_BY_TYPE = {
  c: (ctx) => taskModel.findCustomerInprogress(ctx),
  e: (ctx) => taskModel.findEmployeeInprogress(ctx),
  d: (ctx) => taskModel.findDealerInprogress(ctx),
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

      const hasImage = files.some((name) =>
        name.toLowerCase().endsWith(".jpg")
      );
      const hasVideo = files.some((name) =>
        name.toLowerCase().endsWith(".mov")
      );
      const data = {
        id: row.STT_JOBNO ?? row.JOB_NO,
        ...(row.CUSTNAME ? { schoolName: row.CUSTNAME } : {}),
        ticket: row.STT_TAR_NO,
        room: row.STT_ROOM_NO,
        description: row.STT_DET,
        status: row.STATUS,
        updatedAt: row.STT_DATE,
        commentsCount: 3,
        canRate: row.STT_STATUS === "Y",
        rating: row.RATING ? true : false,
        dueDate: row.SSMT_ENDJOB_DATE ?? null,
        hasImage,
        hasVideo,
        ...(userType === "d" && row.END_SV_DATE
          ? { endsv_job: row.END_SV_DATE }
          : {}),
        ...(userType === "d" && row.EXHIBITION_48
          ? { eduExh48: row.EXHIBITION_48 }
          : {}),
      };
      tasks.push(data);
    }
    return tasks;
  });
}
