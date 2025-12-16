import multer from "multer";
import path from "path";
import { imageUploadDir, commentImageDir } from "../../config/upload.js";
import { withConnect } from "../../shared/db/transaction.js";
import { taskModel } from "./task.model.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imageUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const tarNo = req.tarNo;

    if (typeof req.fileIndex !== "number") {
      req.fileIndex = 0;
    }
    req.fileIndex += 1;

    const filename = `${tarNo}_${req.fileIndex}${ext}`;
    cb(null, filename);
  },
});

const multerCommentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, commentImageDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    withConnect(async (conn) => {
      const jobNo = req.body?.jobNo;
      if (!jobNo) throw new Error("jobNo is required");

      const { rows } = await taskModel.getRefNoComment({ conn, jobNo });
      const sub = rows?.[0]?.SUB;

      req.body.sub = sub; // เก็บค่า sub ไว้ใน req.body เผื่อใช้ต่อ
      return `${jobNo}_${sub}${ext}`;
    })
      .then((filename) => cb(null, filename))
      .catch((err) => cb(err));
  },
});

export const uploadImage = multer({ storage });
export const uploadCommentImage = multer({ storage: multerCommentStorage });
