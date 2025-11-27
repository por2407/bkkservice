// server.js
import http from "http";
import { createApp } from "./src/app.js";
import { initOracle, closePool } from "./src/config/oracle.js";
import { cfg } from "./src/config/env.js";

const app = createApp();
const server = http.createServer(app);

// ตั้งค่า timeout ต่าง ๆ ให้เหมาะกับ production
server.requestTimeout = 30_000;      // 30s สำหรับคำขอปกติ
server.headersTimeout = 35_000;      // ต้องมากกว่า requestTimeout นิดหน่อย
server.keepAliveTimeout = 10_000;    // ลดการค้าง connection ยาว ๆ
server.maxRequestsPerSocket = 0;     // 0 = ไม่จำกัด (หรือกำหนดเองได้)

// ฟังก์ชันเริ่มเซิร์ฟเวอร์ + Oracle
async function start() {
  try {
    await initOracle();
    console.log("Oracle pool initialized");

    server.listen(cfg.port, () => {
      console.log(`API server running at http://localhost:${cfg.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// ฟังก์ชันปิดทุกอย่างแบบนิ่ม ๆ (graceful shutdown)
async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);

  // ปิดรับ request ใหม่
  server.close(async (err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
    } else {
      console.log("HTTP server closed");
    }

    try {
      await closePool();
      console.log("Oracle pool closed");
    } catch (dbErr) {
      console.error("Error closing Oracle pool:", dbErr);
    } finally {
      process.exit(err ? 1 : 0);
    }
  });
}

// จัดการ signal ต่าง ๆ เวลา kill process
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C

// กัน case promise พังแล้วไม่ได้ catch
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

// เริ่มทำงานจริง
start();
