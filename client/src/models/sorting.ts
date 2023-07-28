import {
  LOCAL_STORAGE_ACTOR_SORT,
  LOCAL_STORAGE_FILM_SORT,
} from "constants/common";

export type FilmSortType = "upload" | "year" | "rating";
export type ActorSortType = "name" | "birthDay" | "rating";

export type SortType = FilmSortType | ActorSortType;

export type SortOrder = "desc" | "asc";

export type SortKey =
  | typeof LOCAL_STORAGE_FILM_SORT
  | typeof LOCAL_STORAGE_ACTOR_SORT;

export interface ISort {
  sortType: SortType;
  sortOrder: SortOrder;
}

export interface ISortContext {
  filmSort: ISort;
  actorSort: ISort;
  handleSort: (
    sortKey: SortKey,
    sortType: SortType,
    sortOrder: SortOrder
  ) => void;
}

export interface ISorting {
  dataLength: number;
}
