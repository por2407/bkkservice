// stores/auth.ts
import { defineStore } from "pinia";
import { useCookie } from "#app";
import type { User, UserType, appType } from "@/types/auth";
import { useAuth } from "@/composables/useAuth";

const COOKIE_OPTS = {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
  sameSite: "lax" as const,
  secure: true,
};

const LS_KEY = "user_profile";

// type guards สำหรับ literal unions
function isAppType(v: unknown): v is appType {
  return v === "w" || v === "a";
}
function isUserType(v: unknown): v is UserType {
  return v === "c" || v === "e" || v === "d";
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (s) => s.user !== null,
    isMobile: (s) => s.user?.appType === "a",
  },
  actions: {
    setUser(u: User | null) {
      this.user = u;

      const userCode = useCookie<string | null>("user_code", COOKIE_OPTS);
      const custSeq = useCookie<string | null>("cust_seq", COOKIE_OPTS);
      const appTypeCookie = useCookie<appType | null>("apptype", COOKIE_OPTS);
      const userTypeCookie = useCookie<UserType | null>(
        "user_type",
        COOKIE_OPTS
      );

      userCode.value = u?.userCode ?? null;
      custSeq.value = u?.custSeq ?? null;
      appTypeCookie.value = u?.appType ?? null;
      userTypeCookie.value = u?.userType ?? null;

      if (!import.meta.server) {
        if (u) {
          const payload = { name: u.name ?? "", school: u.school ?? undefined };
          localStorage.setItem(LS_KEY, JSON.stringify(payload));
        } else {
          localStorage.removeItem(LS_KEY);
        }
      }
    },

    async loadUser() {
      const userCode = useCookie<string | null>("user_code");
      const custSeq = useCookie<string | null>("cust_seq");
      const appTypeCookie = useCookie<string | null>("apptype");
      const userTypeCookie = useCookie<string | null>("user_type");

      let name: string | null = null;
      let school: string | null = null;

      if (!import.meta.server) {
        try {
          const raw = localStorage.getItem(LS_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as {
              name?: string;
              school?: string;
            };
            name = parsed.name ?? null;
            school = parsed.school ?? null;
          } else if (userCode.value && custSeq.value) {
            const auth = useAuth();
            const r = await auth.me(userCode.value, custSeq.value);
            name = r.name ?? null;
            school = r.school ?? null;
          }
        } catch {
          localStorage.removeItem(LS_KEY);
        }
      }

      // แคบค่าจากคุกกี้ให้เป็น literal unions ก่อน
      const app = appTypeCookie.value;
      const utype = userTypeCookie.value;

      const hasRequired =
        !!userCode.value && isAppType(app) && isUserType(utype);

      // สร้าง User ก็ต่อเมื่อมีฟิลด์บังคับครบ และให้ name เป็น string เสมอ
      this.user = hasRequired
        ? {
            userCode: userCode.value as string,
            custSeq: custSeq.value ?? undefined,
            appType: app as appType,
            userType: utype as UserType,
            name: name ?? "",
            school: school ?? undefined,
          }
        : null;
    },

    clear() {
      this.setUser(null);
    },
  },
});
