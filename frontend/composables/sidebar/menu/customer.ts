import {
  HomeIcon,
  FilePlus2,
  Gift,
  GraduationCap,
} from "lucide-vue-next";
import type { menu } from "@/types/sidebar";

export const customer: menu[] = [
  { label: "หน้าหลัก", to: "/customer", icon: HomeIcon, external: false },
  {
    label: "แจ้งงานใหม่",
    to: "/customer/jobs",
    icon: FilePlus2,
    external: false,
  },
  {
    label: "แลกรางวัล",
    to: "https://www.google.com/",
    icon: Gift,
    badge: "3",
    external: true,
  },
  {
    label: "168 Training",
    to: "https://www.google.com/",
    icon: GraduationCap,
    external: true,
  },
];
