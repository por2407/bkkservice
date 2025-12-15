import { isDev } from "../../config/env.js";

export function errorHandler(err, req, res, next) {
  // ---- กันไม่ให้เบราว์เซอร์ cache error response ----
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Vary", "Cookie, Authorization");

  if (!err.isOperational) {
    // Error ซ่อนรายละเอียด
    if (isDev) console.log("[FATAL ERROR]", err);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }

  // Error ส่งข้อมูลตามที่กำหนด
  if (isDev) console.log(`[ERROR] message: ${err.message}`);
  res.status(err.httpStatus || 500).json({
    message: err.message,
  });
}
