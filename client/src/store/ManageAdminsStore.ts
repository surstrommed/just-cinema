import { action, flow, makeAutoObservable, observable } from "mobx";
import { IUser } from "models/user";
import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import { STORE_STATUSES } from "models/store";
import {
  AdminsResponse,
  AdminResponse,
  IManageAdminsValues,
} from "models/adminpanel";
import { createAdmin, deleteAdmin, getAdmins } from "api/manageAdmins";

class ManageAdminsStore {
  createdAdmin = null as IUser | null;
  admins = null as IUser[] | null;
  totalAdmins = null as number | null;
  statuses = {
    createAdmin: IDLE_STORE_STATUS,
    getAdmins: IDLE_STORE_STATUS,
    deleteAdmin: IDLE_STORE_STATUS,
  } as STORE_STATUSES;
  responseMessage = null as string | null;

  constructor() {
    makeAutoObservable(this, {
      admins: observable,
      totalAdmins: observable,
      createdAdmin: observable,
      responseMessage: observable,
      createAdmin: flow,
      getAdmins: flow,
      deleteAdmin: flow,
      handleResponseMessage: action,
    });
  }

  handleResponseMessage(msg: string | null) {
    this.responseMessage = msg;
  }

  *createAdmin(adminValues: IManageAdminsValues) {
    this.createdAdmin = null;
    this.statuses.createAdmin = PENDING_STORE_STATUS;
    try {
      const { data }: { data: AdminResponse } = yield createAdmin(adminValues);
      this.createdAdmin = data.user;
      this.responseMessage = data.message;
      this.statuses.createAdmin = DONE_STORE_STATUS;
    } catch {
      this.statuses.createAdmin = ERROR_STORE_STATUS;
    }
  }

  *getAdmins() {
    this.admins = null;
    this.totalAdmins = null;
    this.statuses.getAdmins = PENDING_STORE_STATUS;
    try {
      const { data }: { data: AdminsResponse } = yield getAdmins();
      this.admins = data.users;
      this.totalAdmins = data.totalAdmins;
      this.statuses.getAdmins = DONE_STORE_STATUS;
    } catch {
      this.statuses.getAdmins = ERROR_STORE_STATUS;
    }
  }

  *deleteAdmin(adminId: string) {
    this.admins = null;
    this.statuses.deleteAdmin = PENDING_STORE_STATUS;
    try {
      const { data }: { data: AdminsResponse } = yield deleteAdmin(adminId);
      this.admins = data.users;
      this.totalAdmins = data.totalAdmins;
      this.responseMessage = data.message;
      this.statuses.deleteAdmin = DONE_STORE_STATUS;
    } catch {
      this.statuses.deleteAdmin = ERROR_STORE_STATUS;
    }
  }
}

const manageAdminsStore = new ManageAdminsStore();

export default manageAdminsStore;
