import { createContext, useContext } from "react";
import userStore from "./UserStore";
import uploadFileStore from "./UploadFileStore";
import manageAdminsStore from "./ManageAdminsStore";
import manageFilmStore from "./ManageFilmStore";
import manageCategoryStore from "./ManageCategoryStore";
import manageCommentsStore from "./ManageCommentsStore";
import manageActorsStore from "./ManageActorsStore";

const store = {
  userStore,
  uploadFileStore,
  manageAdminsStore,
  manageFilmStore,
  manageCategoryStore,
  manageCommentsStore,
  manageActorsStore,
};

export const StoreContext = createContext(store);

export const useStore = () => {
  return useContext<typeof store>(StoreContext);
};

export default store;
