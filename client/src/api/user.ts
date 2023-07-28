import { IProfileUpdateValues } from "models/profile";
import API from "./api";

export const getMyUserData = () => API.get("/myuser");

export const updateUserData = (
  userId: string,
  userData: IProfileUpdateValues
) => API.patch(`/users/${userId}`, userData);
export const manageFilmFromWatchLater = (filmId: string) =>
  API.patch(`/users/manageFilmFromWatchLater/${filmId}`);
