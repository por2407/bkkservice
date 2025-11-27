import { allowedOrigins } from "./env.js";

export const corsOptions = {
  // กำหนดออปชันสำหรับ CORS
  origin: (origin, callback) => {
    // ฟังก์ชันเพื่อตรวจสอบโดเมนที่เรียกใช้งาน
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // เปิดการส่ง credentials (cookie)
  optionsSuccessStatus: 200, // ตั้งค่าสถานะ HTTP สำหรับคำขอ OPTIONS ที่สำเร็จ
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH"], // กำหนดวิธี HTTP ที่อนุญาต
};
