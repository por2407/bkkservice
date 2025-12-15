export function toOracleDateTime(value) {
  if (!value) return null; // กัน null/undefined ไว้ก่อน

  const [datePart, timePart] = value.split("T"); // '2025-12-08', '15:15'
  const [year, month, day] = datePart.split("-"); // ['2025','12','08']
  const [hour, minute] = timePart.split(":"); // ['15','15']

  return (
    `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year} ` +
    `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`
  );
}
