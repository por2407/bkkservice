import oracledb from "oracledb";
import { cfg, isDev } from "./env.js";

if (!oracledb.oracleClientVersion && cfg.instant) {
    oracledb.initOracleClient({ libDir: cfg.instant });
  }

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let pool;
let statsTimer;

const dbConfig = {
  user: cfg.user,
  password: cfg.pass,
  connectString: cfg.connect,
  poolMin: 0, // ไม่มี user → ไม่ค้าง connection
  poolMax: 50, // ลดลงเพื่อไม่ชน limit session
  poolIncrement: 5, // ขยายทีละ 5
  poolTimeout: 120, // > 0 เพื่อปิด idle connections อัตโนมัติ (ใช้ได้กับ 11g)
  poolPingInterval: 90,
  stmtCacheSize: 30,
  queueMax: 100, // ลดคิวลงให้สมดุลกับ session limit
  queueTimeout: 15000,
  enableStatistics: true,
  poolAlias: "defaultPool",
};

export async function initOracle() {
  try {
    if (pool) {
      console.log("Oracle DB pool already initialized");
      return;
    }

    pool = await oracledb.createPool(dbConfig);

    if (isDev) {
      let last = { open: -1, inUse: -1, enq: -1 };
      statsTimer = setInterval(() => {
        if (!pool) return;
        const s = pool.getStatistics();
        const open = s.connectionsOpen;
        const inUse = s.connectionsInUse;
        const enq = s.requestsEnqueued;
        if (open !== last.open || inUse !== last.inUse || enq !== last.enq) {
          console.log(`[DB] open=${open} inUse=${inUse} enqueued=${enq}`);
          last = { open, inUse, enq };
        }
      }, 60_000);
    }
  } catch (error) {
    console.error("Error creating Oracle pool", error);
    throw error;
  }
}

export async function getConnection() {
  if (!pool) throw new Error("Oracle pool not initialized");
  return pool.getConnection();
}


export async function closePool(){
    if (!pool) {
      console.warn("Oracle pool is not initialized or already closed");
      return;
    }
    try {
      await pool.close(10);
      pool = null;
      console.log("Oracle DB pool closed");
      if (isDev && statsTimer) {
        clearInterval(statsTimer);
        statsTimer = null;
      }
    } catch (error) {
      console.error("Error closing Oracle pool", error);
    }
  };
