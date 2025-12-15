import { withTransaction, withConnect } from "../../shared/db/transaction.js";
import { taskModel } from "./task.model.js";
import { AppErrors } from "../../shared/error/appError.js";

export const taskService = {
  taskStatuses,
  taskDetail,
  newTask,
  taskTimeLine,
  activeStatus,
  getTaskStartDate,
  taskUpdateService,
  processJobScoringWorkflow,
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
    const row = rows?.[0];

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

    const canRate =
      row.STT_STATUS === "Y" && (userType === "c" ? row.CANRATING === 1 : true);
    const rating = row.BTDST_SCORE ?? null;

    let ratingItems;
    if (canRate && rating && type) {
      const { rows: descriptionTaskScore } =
        await taskModel.customer.findDescriptionTaskScore({ conn });
      ratingItems =
        descriptionTaskScore.map((item) => {
          return {
            id: item.SJSR_CODE,
            label: item.DVNAME,
          };
        }) ?? undefined;
    }

    data = {
      id: row.STT_JOBNO,
      ticket: row.STT_TAR_NO,
      room: row.STT_ROOM_NO,
      description: row.STT_DET,
      status: row.STATUS,
      updatedAt: row.STT_DATE,
      canRate,
      rating,
      currentStep,
      media,
      timeline,
      isSubmit,
      ratingItems,
    };

    return data;
  });
}

async function taskTimeLine({ tarNo, userType, isCanRate }) {
  const type = userType !== "e";
  return withConnect(async (conn) => {
    const timeline = [];
    let ratingItems;

    const { rows } = await taskModel.getPartialInfo({ conn, tarNo, type });
    const JobNo = rows?.[0]?.STT_JOBNO;
    const isSubmit = !type ? !!rows?.[0]?.BTDST_SUBMIT_DATE : undefined;
    if (!JobNo)
      return {
        timeline,
        isSubmit,
        ratingItems,
      };

    if ((isCanRate === "true" || isCanRate === true) && type) {
      const { rows: descriptionTaskScore } =
        await taskModel.customer.findDescriptionTaskScore({ conn });
      ratingItems =
        descriptionTaskScore.map((item) => {
          return {
            id: item.SJSR_CODE,
            label: item.DVNAME,
          };
        }) ?? undefined;
    }

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
      ratingItems,
    };
  });
}

async function newTask({ data }) {
  return withTransaction(
    async (conn) =>
      await taskModel.customer.createNewTask({ conn, payload: data })
  );
}

async function activeStatus({ payload }) {
  return withTransaction(async (conn) => {
    const result = await taskModel.employee.updateStatus({
      conn,
      payload,
    });

    const { rowsAffected, outBinds } = result;
    if (!rowsAffected || rowsAffected === 0) {
      throw new AppErrors({
        message: "อัปเดตการทำงานไม่สำเร็จ",
        httpStatus: 500,
      });
    }

    const { userCode, jobNo, typeSeq } = payload;
    const { rows } = await taskModel.employee.checkPendingTasks({
      conn,
      userCode,
      jobNo,
    });

    const remainingCount = rows?.[0]?.CNT;
    let needRefresh = false;
    if (remainingCount === 0 && typeSeq < 5) {
      needRefresh = true;
    }

    // ดึงค่าที่ RETURNING มาใช้งาน
    const finishedAt = outBinds?.outDate?.[0] ?? null;
    const operator = outBinds?.empName?.[0] ?? null;

    return {
      data: {
        finishedAt,
        operator,
      },
      needRefresh,
    };
  });
}

async function getTaskStartDate({ userCode, jobNo }) {
  return withConnect(async (conn) => {
    const result = await taskModel.employee.findTaskStartDate({
      conn,
      userCode,
      jobNo,
    });
    const rows = result?.rows || [];
    return rows[0]?.SSMT_DATE_ST ?? null;
  });
}

async function taskUpdateService({ data }) {
  const {
    userCode,
    jobNo,
    typeCode,
    typeSeq,
    startTime,
    endTime,
    process,
    pending,
  } = data;
  return withTransaction(async (conn) => {
    const result = await taskModel.employee.updateTaskSummaryDetail({
      conn,
      payload: {
        jobNo,
        userCode,
        process,
        pending,
        startTime,
        endTime,
      },
    });
    const { rowsAffected } = result;
    if (!rowsAffected || rowsAffected === 0) {
      throw new AppErrors({
        message: "อัปเดตข้อมูลการดำเนินงานไม่สำเร็จ",
        httpStatus: 500,
      });
    }

    const statusResult = await taskModel.employee.updateStatus({
      conn,
      payload: {
        jobNo,
        userCode,
        typeCode,
        typeSeq,
      },
      startTime,
    });

    const { rowsAffected: statusRowsAffected, outBinds } = statusResult;
    if (!statusRowsAffected || statusRowsAffected === 0) {
      throw new AppErrors({
        message: "อัปเดตข้อมูลการดำเนินงานไม่สำเร็จ",
        httpStatus: 500,
      });
    }

    const { rows } = await taskModel.employee.checkPendingTasks({
      conn,
      userCode,
      jobNo,
    });

    const remainingCount = rows?.[0]?.CNT;
    let needRefresh = false;
    if (remainingCount === 0 && typeSeq < 5) {
      needRefresh = true;
    }

    const finishedAt = outBinds?.outDate?.[0] ?? null;
    const operator = outBinds?.empName?.[0] ?? null;

    const resultFinish = await taskModel.employee.updateTaskFinish({
      conn,
      jobNo,
    });
    const { rowsAffected: finishRowsAffected } = resultFinish;
    if (!finishRowsAffected || finishRowsAffected === 0) {
      throw new AppErrors({
        message: "อัปเดตข้อมูลการดำเนินงานไม่สำเร็จ",
        httpStatus: 500,
      });
    }

    return {
      data: {
        finishedAt,
        operator,
      },
      needRefresh,
    };
  });
}

async function processJobScoringWorkflow({ data }) {
  const { jobNo, userCode, custSeq, scoreList } = data;
  return withTransaction(async (conn) => {
    let sumscore = 0;
    let star = 0;
    // const { rows } = await taskModel.customer.getStartEndDatesByJobNo({
    //   conn,
    //   jobNo,
    // });
    // const { rows: weekDiff } =
    //   await taskModel.customer.getWeekDiffFromThaiStartDate({
    //     conn,
    //     dateStTh: rows?.[0]?.DATEST_TH,
    //   });

    // const sDay = Math.max(Number(weekDiff?.[0]?.SDAY) ?? 0, 0);

    // const { rows: numSday } =
    //   await taskModel.customer.getNumSdayByJobNoAndWeekDiff({
    //     conn,
    //     jobNo,
    //     sDay,
    //   });
    // const numday = numSday?.[0]?.NUMSDAY;

    // let vpoint = 1;

    // if (numday <= 6) {
    //   vpoint = 6;
    // }
    // if (numday == 7) {
    //   vpoint = 5;
    // }
    // if (numday == 8) {
    //   vpoint = 4;
    // }
    // if (numday == 9) {
    //   vpoint = 3;
    // }
    // if (numday == 10) {
    //   vpoint = 2;
    // }
    // if (numday == 11) {
    //   vpoint = 1;
    // }

    // await taskModel.customer.insertJobServiceDetailScore({conn, payload:{jobNo, vCode: index, i:index, vScore:score}})

    for (const score of scoreList) {
      sumscore += Number(score.score);
    }

    return {
      data: {
        jobNo,
        userCode,
        custSeq,
        scoreList,
        sumscore,
      },
    };
  });
}
