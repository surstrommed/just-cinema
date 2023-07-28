import { ICreateFilmFormValues } from "models/film";
import { SortOrder, SortType } from "models/sorting";
import API from "./api";

export const uploadFilm = (filmData: FormData) =>
  API.post("/manageFilms/uploadFilm", filmData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const createFilm = (filmData: ICreateFilmFormValues) =>
  API.post("/manageFilms/createFilm", filmData);
export const getFilms = (
  limit: number,
  page: number,
  sortType: SortType,
  sortOrder: SortOrder
) =>
  API.get(
    `/manageFilms/getFilms?limit=${limit}&page=${page}&sortType=${sortType}&sortOrder=${sortOrder}`
  );
export const getFilmsByCategory = (
  categoryId: string,
  limit: number,
  page: number,
  sortType: SortType,
  sortOrder: SortOrder
) =>
  API.get(
    `/manageFilms/getFilmsByCategory/${categoryId}?limit=${limit}&page=${page}&sortType=${sortType}&sortOrder=${sortOrder}`
  );
export const getFilmById = (filmId: string) =>
  API.get(`/manageFilms/getFilmById/${filmId}`);
export const deleteFilm = (filmId: string, filmFilename: string) =>
  API.delete(`/manageFilms/deleteFilm/${filmId}/${filmFilename}`);
export const likeFilm = (filmId: string) =>
  API.patch(`/manageFilms/manageFilmLike/${filmId}`);
export const dislikeFilm = (filmId: string) =>
  API.patch(`/manageFilms/manageFilmDislike/${filmId}`);
export const getWatchLaterFilms = (
  limit: number,
  page: number,
  sortType: SortType,
  sortOrder: SortOrder
) =>
  API.get(
    `/manageFilms/watchLaterFilms?limit=${limit}&page=${page}&sortType=${sortType}&sortOrder=${sortOrder}`
  );
export const getSearchedFilms = (
  limit: number,
  page: number,
  searchedValue: string,
  sortType: SortType,
  sortOrder: SortOrder
) =>
  API.get(
    `/manageFilms/searchFilms?limit=${limit}&page=${page}&search=${searchedValue}&sortType=${sortType}&sortOrder=${sortOrder}`
  );
