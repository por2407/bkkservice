import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// โฟลเดอร์อัปโหลดหลัก
const uploadRoot = path.resolve(__dirname, "..", "..", "..", "uploads");

// โฟลเดอร์สำหรับเก็บรูปภาพอัปโหลด
export const imageUploadDir = path.resolve(uploadRoot, "img_service");

// สร้างโฟลเดอร์หากยังไม่มี (recursive จะจัดการให้เอง)
fs.mkdirSync(imageUploadDir, { recursive: true });
