const thaiMonthsShort = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export const formatUpdatedAt = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();

  // ตัดเวลาออกให้เหลือแค่วันที่ (ใช้ UTC เพื่อตัดปัญหา timezone)
  const startOfToday = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfDate = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.floor(
    (startOfToday - startOfDate) / (1000 * 60 * 60 * 24)
  );

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const timePart = `${hours}:${minutes}`;

  if (diffDays === 0) {
    return `วันนี้ · ${timePart}`;
  }
  if (diffDays === 1) {
    return `เมื่อวาน · ${timePart}`;
  }
  if (diffDays <= 7) {
    return `${diffDays} วันก่อน · ${timePart}`;
  }

  const d = date.getDate().toString().padStart(2, "0");
  const m = thaiMonthsShort[date.getMonth()];
  const buddhistYear = date.getFullYear() + 543;

  return `${d} ${m} ${buddhistYear} ${timePart}`;
};

export const formatDueDate = (isoString: string) => {
  const date = new Date(isoString);

  const d = date.getDate().toString().padStart(2, "0");
  const m = thaiMonthsShort[date.getMonth()];
  const buddhistYear = date.getFullYear() + 543;

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${d} ${m} ${buddhistYear} ${hours}:${minutes} น.`;
};

export const formatThaiDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const datePart = formatThaiDate(isoString);
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");
  return `${datePart} ${hh}:${mm}:${ss}`;
};

export const formatThaiDate = (isoString: string) => {
  const date = new Date(isoString);
  const d = date.getDate().toString().padStart(2, "0");
  const m = thaiMonthsShort[date.getMonth()];
  const y = date.getFullYear() + 543;
  return `${d} ${m} ${y}`;
};

const TZ_BKK = "Asia/Bangkok";
const pad2 = (n: number) => String(n).padStart(2, "0");

export const toLocalInputString = (d: Date, tz = TZ_BKK): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const y = get("year");
  const m = get("month");
  const day = get("day");
  const h = get("hour");
  const min = get("minute");
  return `${y}-${pad2(m)}-${pad2(day)}T${pad2(h)}:${pad2(min)}`;
};

// ตีความสตริงเป็นเวลาใน Asia/Bangkok แล้วแปลงเป็น Date (UTC)
// ผลแบบสากล: d2.toISOString() -> "2025-10-29T02:16:00.000Z"
export const fromLocalInputString = (s: string, tz = TZ_BKK): Date => {
  const [date, time] = s.split("T");
  if (!date || !time) return new Date();
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  // Bangkok = +07:00 (ไม่มี DST): UTC = local - 7 ชม.
  const utcMs = Date.UTC(y, (m || 1) - 1, d || 1, (hh || 0) - 7, mm || 0, 0, 0);
  return new Date(utcMs);
};
