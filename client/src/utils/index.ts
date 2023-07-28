import {
  DARK_THEME,
  LIGHT_THEME,
  LOCAL_STORAGE_STATE,
  MONTHS,
} from "constants/common";
import { DecodedUserData, LocalStoredProfileData } from "models/user";
import { storagePersister } from "./persister/persister";
import jwt_decode from "jwt-decode";
import { ThemeMode } from "models/theme";
import { STORE_STATUSES } from "models/store";
import { PENDING_STORE_STATUS } from "constants/store";
import { DateFormat } from "models/utils";

export const parsedStoredUser = ((): LocalStoredProfileData | null => {
  let user = null;
  if (typeof window !== "undefined") {
    user = JSON.parse(
      storagePersister.getPersistedItem(LOCAL_STORAGE_STATE) || "null"
    );
  }
  return user;
})();

export const getDecodedTokenData = (token: string | undefined) =>
  token ? jwt_decode<DecodedUserData>(token) : null;

export const themeModeToggle = (mode: ThemeMode) =>
  mode === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;

export const strCapitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const blobToBase64 = (blob: Blob): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result?.toString() || null);
    reader.onerror = () => reject(null);
    reader.readAsDataURL(blob);
  });
};

export const strTrunc = (str: string, limit: number) =>
  str.slice(0, limit) + "...";

export const getPage = (page: string | number | null | undefined) => {
  return !!page && +page > 0 ? +page : 1;
};

export const storeLoadingStatusDetector = (statuses: STORE_STATUSES) =>
  Object.keys(statuses).some(
    (status) => statuses[status] === PENDING_STORE_STATUS
  );

export const getYears = (startYear?: number) => {
  const currentYear = new Date().getFullYear(),
    years = [];
  startYear = startYear || 1900;
  while (startYear <= currentYear) {
    years.push((startYear++).toString());
  }
  return years;
};

export const getFormattedDate = (date: Date, format: DateFormat) => {
  if (format === "YYYY-MM-DD") {
    let month = `${date.getMonth() + 1}`;
    if (+month < 10) {
      month = `0${month}`;
    }
    return `${date.getFullYear()}-${month}-${date.getDate()}`;
  } else {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
};

export const getFormattedHeight = (height: number) => {
  return `${height / 100} m`;
};
