import { flow, makeAutoObservable, observable, action } from "mobx";
import { signIn, signUp } from "api/auth";
import { AuthResponse, ISignInValues, ISignUpValues } from "models/auth";
import { IUser } from "models/user";
import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import { STORE_STATUSES } from "models/store";
import { storagePersister } from "utils/persister/persister";
import {
  getMyUserData,
  updateUserData,
  manageFilmFromWatchLater,
} from "api/user";
import { IProfileUpdateValues } from "models/profile";
import { LOCAL_STORAGE_STATE } from "constants/common";
import { parsedStoredUser } from "utils";

class UserStore {
  user = null as IUser | null;
  statuses = {
    getMyUserData: IDLE_STORE_STATUS,
    signIn: IDLE_STORE_STATUS,
    signUp: IDLE_STORE_STATUS,
    updateUserData: IDLE_STORE_STATUS,
    manageFilmFromWatchLater: IDLE_STORE_STATUS,
  } as STORE_STATUSES;

  constructor() {
    makeAutoObservable(this, {
      user: observable,
      getMyUserData: flow,
      signIn: flow,
      signUp: flow,
      updateUserData: flow,
      manageFilmFromWatchLater: flow,
      logout: action,
    });
  }

  *getMyUserData() {
    this.user = null;
    this.statuses.getMyUserData = PENDING_STORE_STATUS;
    try {
      const { data }: { data: IUser } = yield getMyUserData();
      this.user = data;
      this.statuses.getMyUserData = DONE_STORE_STATUS;
      return data;
    } catch {
      this.statuses.getMyUserData = ERROR_STORE_STATUS;
    }
  }

  *signIn(signinValues: ISignInValues) {
    this.user = null;
    this.statuses.signIn = PENDING_STORE_STATUS;
    try {
      const { data }: { data: AuthResponse } = yield signIn(signinValues);
      this.user = data.user;
      storagePersister.persistItem(
        LOCAL_STORAGE_STATE,
        JSON.stringify({ token: data.token })
      );
      this.statuses.signIn = DONE_STORE_STATUS;
      return data;
    } catch {
      this.statuses.signIn = ERROR_STORE_STATUS;
    }
  }

  *signUp(signUpValues: ISignUpValues) {
    this.user = null;
    this.statuses.signUp = PENDING_STORE_STATUS;
    try {
      const { data }: { data: AuthResponse } = yield signUp(signUpValues);
      this.user = data.user;
      this.statuses.signUp = DONE_STORE_STATUS;
      return data;
    } catch {
      this.statuses.signUp = ERROR_STORE_STATUS;
    }
  }

  *updateUserData(userId: string, userData: IProfileUpdateValues) {
    this.statuses.updateUserData = PENDING_STORE_STATUS;
    try {
      const { data }: { data: IUser } = yield updateUserData(userId, userData);
      this.user = data;
      this.statuses.updateUserData = DONE_STORE_STATUS;
      return data;
    } catch {
      this.statuses.updateUserData = ERROR_STORE_STATUS;
    }
  }

  *manageFilmFromWatchLater(filmId: string) {
    this.statuses.manageFilmFromWatchLater = PENDING_STORE_STATUS;
    try {
      const { data }: { data: IUser } = yield manageFilmFromWatchLater(filmId);
      this.user = data;
      this.statuses.manageFilmFromWatchLater = DONE_STORE_STATUS;
      return data;
    } catch {
      this.statuses.manageFilmFromWatchLater = ERROR_STORE_STATUS;
    }
  }

  logout() {
    this.user = null;
    storagePersister.deletePersistedItem(LOCAL_STORAGE_STATE);
    this.statuses.signIn = IDLE_STORE_STATUS;
    this.statuses.signUp = IDLE_STORE_STATUS;
  }
}

const userStore = new UserStore();
if (parsedStoredUser) userStore.getMyUserData();

export default userStore;
