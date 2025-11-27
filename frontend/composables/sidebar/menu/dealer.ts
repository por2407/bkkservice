import {
    HomeIcon,
    History,
    HandCoins,
  } from "lucide-vue-next";
  import type { menu } from "@/types/sidebar";
  
  export const dealer: menu[] = [
    { label: "หน้าหลัก", to: "/dealer", icon: HomeIcon, external: false },
    {
        label: "สอบถามประวัติ",
        to: "/dealer/history",
        icon: History,
        external: false,
      },
      {
        label: "ข้อมูลลูกหนี้",
        to: "/dealer/aging-report",
        icon: HandCoins,
        external: false,
      },
  ];
  