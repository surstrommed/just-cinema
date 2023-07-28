import { IManageActorsValues } from "models/actor";
import { SortType, SortOrder } from "models/sorting";
import API from "./api";

export const createActor = (actorData: IManageActorsValues) =>
  API.post("/manageActors/createActor", actorData);
export const getActors = (
  limit: number,
  page: number,
  sortType: SortType,
  sortOrder: SortOrder
) =>
  API.get(
    `/manageActors/getActors?limit=${limit}&page=${page}&sortType=${sortType}&sortOrder=${sortOrder}`
  );
export const getSearchedActors = (
  limit: number,
  page: number,
  searchedValue: string,
  sortType: SortType,
  sortOrder: SortOrder
) =>
  API.get(
    `/manageActors/searchActors?limit=${limit}&page=${page}&search=${searchedValue}&sortType=${sortType}&sortOrder=${sortOrder}`
  );
export const deleteActor = (actorId: string) =>
  API.delete(`/manageActors/deleteActor/${actorId}`);
export const likeActor = (actorId: string) =>
  API.patch(`/manageActors/manageActorLike/${actorId}`);
export const dislikeActor = (actorId: string) =>
  API.patch(`/manageActors/manageActorDislike/${actorId}`);
