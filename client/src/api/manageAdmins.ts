import { IManageAdminsValues } from "models/adminpanel";
import API from "./api";

export const createAdmin = (adminData: IManageAdminsValues) =>
  API.post("/manageAdmins/createAdmin", adminData);
export const getAdmins = () => API.get("/manageAdmins/getAdmins");
export const deleteAdmin = (adminId: string) =>
  API.delete(`/manageAdmins/deleteAdmin/${adminId}`);
