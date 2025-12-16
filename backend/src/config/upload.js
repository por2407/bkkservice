import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// โฟลเดอร์อัปโหลดหลัก
const uploadRoot = path.resolve(__dirname, "..", "..", "..", "uploads");

// โฟลเดอร์สำหรับเก็บรูปภาพอัปโหลด
export const imageUploadDir = path.resolve(uploadRoot, "img_service");
// โฟลเดอร์สำหรับเก็บไฟล์ภาพ Comment
export const commentImageDir = path.resolve(uploadRoot, "comment_images");

// สร้างโฟลเดอร์หากยังไม่มี (recursive จะจัดการให้เอง)
fs.mkdirSync(imageUploadDir, { recursive: true });
fs.mkdirSync(commentImageDir, { recursive: true });