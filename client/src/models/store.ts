import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";

export type STORE_STATUS =
  | typeof IDLE_STORE_STATUS
  | typeof PENDING_STORE_STATUS
  | typeof ERROR_STORE_STATUS
  | typeof DONE_STORE_STATUS;

export interface STORE_STATUSES {
  [status: string]: STORE_STATUS;
}
