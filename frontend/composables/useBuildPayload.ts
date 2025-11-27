import { useAuthStore } from "@/stores/auth.stores";

export function useBuildPayload<T extends Record<string, any>>(data: T) {
  const auth = useAuthStore();
  const user = auth.user;

  return {
    ...data,
    userCode: user?.userCode,
    ...(user?.custSeq ? { custSeq: user?.custSeq } : {}),
    userType: user?.userType,
  };
}
