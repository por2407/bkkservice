import { useAuthStore } from "@/stores/auth.stores";
import { routesByRole } from "@/constants/auth";
import type { User } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  async function me(userCode: string, custSeq: string) {
    return { name: "ชัชวาลย์", school: "โรงเรียนรัตนโกสินทร์" };
  }

  async function login(user: string, pass: string) {
    let data: User;
    try {
      if (user == "customer" && pass == "customer") {
        data = {
          userCode: "00005",
          custSeq: "27",
          appType: "a",
          userType: "c",
          name: "กันยา",
          school: "โรงเรียนรัตนโกสินทร์",
        };
      } else if (user == "employee" && pass == "employee") {
        data = {
          userCode: "440020",
          appType: "a",
          userType: "e",
          name: "ชัชวาลย์",
        };
      } else if(user === 'dealer' && pass === 'dealer'){
        data = {
          userCode: "2",
          appType: "a",
          userType: "d",
          name: "เพชร",
        };
      }
      else {
        throw new Error("Invalid username or password");
      }
      authStore.setUser(data);
      const path = routesByRole[data.userType] ?? "";
      router.push(path);
    } catch (e: any) {
      throw e;
    }
  }

  async function logout() {
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  return { me, login, logout };
}
