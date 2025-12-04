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