import multer from "multer";
import path from "path";
import { imageUploadDir } from "../../config/upload.js";

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

export const uploadImage = multer({ storage });
