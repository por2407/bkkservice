import { HomeIcon, UploadCloud, BookOpen, Building2 } from "lucide-vue-next";
import type { menu } from "@/types/sidebar";

export const employee: menu[] = [
  { label: "หน้าหลัก", to: "/employee", icon: HomeIcon, external: false },

  {
    label: "อัปโหลดประกาศนียบัตร",
    to: "/employee/certificates",
    icon: UploadCloud,
    external: false,
  },

  {
    label: "สื่อการเรียนรู้",
    to: "/employee/learning",
    icon: BookOpen,
    badge: "3",
    external: false,
  },

  {
    label: "ระบบภายในบริษัท",
    to: "https://www.google.com/",
    icon: Building2,
    external: true,
  },
];
