import { taskModel } from "../../api/task/task.model.js";
import { withConnect } from "../db/transaction.js";

export async function getTarNo(req, res, next) {
  try {
    const tarNo = await withConnect(async (conn) => {
      const { rows } = await taskModel.customer.nextRefTask({ conn });
      return rows?.[0]?.STT_TAR_NO;
    });
    if (!tarNo) {
      throw new Error("Cannot generate tarNo");
    }
    req.tarNo = tarNo;
    next();
  } catch (e) {
    next(e);
  }
}
