import { flow, makeAutoObservable, observable } from "mobx";
import { STORE_STATUSES } from "models/store";
import { uploadPhoto } from "api/upload";
import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import { FileResponse } from "models/film";

class UploadFileStore {
  link = null as string | null;
  statuses = {
    uploadFile: IDLE_STORE_STATUS,
  } as STORE_STATUSES;

  constructor() {
    makeAutoObservable(this, {
      link: observable,
      uploadFile: flow,
    });
  }

  handleLink(link: string | null) {
    this.link = link;
  }

  *uploadFile(file: File) {
    this.link = null;
    this.statuses.uploadFile = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FileResponse } = yield uploadPhoto(file);
      this.link = data.url;
      this.statuses.uploadFile = DONE_STORE_STATUS;
      return data.data;
    } catch {
      this.statuses.uploadFile = ERROR_STORE_STATUS;
    }
  }
}

const uploadFileStore = new UploadFileStore();

export default uploadFileStore;
