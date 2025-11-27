export type UserType = "c" | "e" | "d";
export type appType = "w" | "a";

export type User = {
  userCode: string;
  custSeq?: string;
  appType: appType;
  userType: UserType;
  name: string;
  school?: string;
};
