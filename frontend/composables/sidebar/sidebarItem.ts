import { customer } from "./menu/customer";
import { employee } from "./menu/employee";
import { dealer } from "./menu/dealer";
import { useAuthStore } from "@/stores/auth.stores";
import type { menu } from "@/types/sidebar";
import type { UserType } from "@/types/auth";

// แมปอย่างมี type safety
const DICT: Record<UserType, menu[]> = {
  c: customer,
  e: employee,
  d: dealer,
};

// ฟังก์ชันเลือกเมนู พร้อมค่า fallback
function pickMenu(type?: string): menu[] {
  const t = (type || "c") as UserType;
  return DICT[t] ?? DICT.c;
}

export const useSidebarMenu = () => {
  const authStore = useAuthStore();

  // ทำให้รีแอคทีฟ—เปลี่ยนทันทีเมื่อ userType ใน store เปลี่ยน
  const sidebarMenu = computed<menu[]>(() => {
    // ถ้าอยากกันการแก้ไข array ต้นฉบับ ให้คลายสำเนาใหม่
    return [...pickMenu(authStore.user?.userType)];
  });

  return { sidebarMenu };
};
