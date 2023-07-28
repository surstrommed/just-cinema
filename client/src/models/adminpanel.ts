import { IUser } from "./user";
import { adminPanelSections } from "constants/adminpanel";

export interface IManageAdminsFormValues {
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
  adminConfirmPassword: string;
}

export interface IManageAdminsValues {
  name: string;
  email: string;
  password: string;
}

export interface AdminResponse {
  user: IUser;
  message: string;
}

export interface AdminsResponse {
  users: IUser[];
  totalAdmins: number;
  message: string;
}

export interface IAdminSidebar {
  header: React.ReactNode;
  content: React.ReactNode;
}

export interface IAdminSidebarContext {
  isAdminSidebarOpened: boolean;
  toggleAdminSidebar: () => void;
}

export type IAdminSections = typeof adminPanelSections;
export type IAdminSectionsKey = keyof IAdminSections;
