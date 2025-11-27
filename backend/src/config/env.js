import dotenv from "dotenv";
dotenv.config();

export const isDev = process.env.NODE_ENV === "dev";

export const allowedOrigins = process.env.CORS_URL.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const cfg = {
  port: process.env.PORT,
  connect: process.env.CONNECT,
  user: process.env.USER,
  pass: process.env.PASS,
  instant: process.env.ORACLE_LIB_DIR,
};
