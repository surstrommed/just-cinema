import { ADMIN_ROLE, SUPER_ADMIN_ROLE, USER_ROLE } from "constants/common";

export type UserRole =
  | typeof USER_ROLE
  | typeof ADMIN_ROLE
  | typeof SUPER_ADMIN_ROLE;

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string | null;
  watchLater: string[];
  createdAt: string;
}

export interface LocalStoredProfileData {
  token: string;
}

export interface DecodedUserData {
  email: string;
  exp: number;
  iat: number;
  id: string;
}
