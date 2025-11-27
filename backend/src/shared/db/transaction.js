import { getConnection } from "../../config/oracle.js";

export async function withConnect(fn) {
  const conn = await getConnection();
  try {
    return await fn(conn);
  } catch (e) {
    throw e;
  } finally {
    try {
      await conn.close();
    } catch {}
  }
}

export async function withTransaction(fn) {
  const conn = await getConnection();
  try {
    const out = await fn(conn);
    await conn.commit();
    return out;
  } catch (e) {
    try {
      await conn.rollback();
    } catch {}
    throw e;
  } finally {
    try {
      await conn.close();
    } catch {}
  }
}
