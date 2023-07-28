import { action, flow, makeAutoObservable, observable } from "mobx";
import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import { STORE_STATUSES } from "models/store";
import {
  CreatedFilmResponse,
  FilmResponse,
  FilmsResponse,
  IFilmWithCategory,
  IUploadFilmValues,
  UploadedFilmResponse,
} from "models/film";
import { IUploadedVideoFile, StoredFilmsData } from "models/film";
import {
  createFilm,
  deleteFilm,
  getFilmById,
  getFilms,
  getFilmsByCategory,
  uploadFilm,
  likeFilm,
  dislikeFilm,
  getWatchLaterFilms,
  getSearchedFilms,
} from "api/manageFilms";
import { SortOrder, SortType } from "models/sorting";

class ManageFilmStore {
  uploadedFilm = null as IUploadedVideoFile | null;
  createdFilm = null as IFilmWithCategory | null;
  film = null as IFilmWithCategory | null;
  films = null as StoredFilmsData | null;
  filmsByCategory = null as StoredFilmsData | null;
  searchedFilms = null as StoredFilmsData | null;
  thumbnail = null as string | null;
  statuses = {
    uploadFilm: IDLE_STORE_STATUS,
    createFilm: IDLE_STORE_STATUS,
    getFilms: IDLE_STORE_STATUS,
    deleteFilm: IDLE_STORE_STATUS,
    getFilmsByCategory: IDLE_STORE_STATUS,
    getFilmById: IDLE_STORE_STATUS,
    likeFilm: IDLE_STORE_STATUS,
    dislikeFilm: IDLE_STORE_STATUS,
    getWatchLaterFilms: IDLE_STORE_STATUS,
    getSearchedFilms: IDLE_STORE_STATUS,
  } as STORE_STATUSES;
  responseMessage = null as string | null;

  constructor() {
    makeAutoObservable(this, {
      createdFilm: observable,
      films: observable,
      filmsByCategory: observable,
      searchedFilms: observable,
      thumbnail: observable,
      responseMessage: observable,
      uploadFilm: flow,
      createFilm: flow,
      getFilms: flow,
      deleteFilm: flow,
      getFilmsByCategory: flow,
      getFilmById: flow,
      likeFilm: flow,
      dislikeFilm: flow,
      getWatchLaterFilms: flow,
      getSearchedFilms: flow,
      handleThumbnail: action,
      handleResponseMessage: action,
    });
  }

  handleThumbnail(thumbnail: string | null) {
    this.thumbnail = thumbnail;
  }

  handleResponseMessage(msg: string | null) {
    this.responseMessage = msg;
  }

  *uploadFilm(filmFormData: FormData) {
    this.uploadedFilm = null;
    this.statuses.uploadFilm = PENDING_STORE_STATUS;
    try {
      const { data: uploadFilmData }: { data: UploadedFilmResponse } =
        yield uploadFilm(filmFormData);
      this.uploadedFilm = uploadFilmData.file;
      this.statuses.uploadFilm = DONE_STORE_STATUS;
    } catch {
      this.statuses.uploadFilm = ERROR_STORE_STATUS;
    }
  }

  *createFilm(
    fileData: { fileID: string; filename: string },
    filmData: IUploadFilmValues
  ) {
    this.createdFilm = null;
    this.statuses.createFilm = PENDING_STORE_STATUS;
    try {
      const { data: createdFilmData }: { data: CreatedFilmResponse } =
        yield createFilm({
          ...filmData,
          filename: fileData.filename,
          fileID: fileData.fileID,
        });
      this.createdFilm = createdFilmData.film;
      this.responseMessage = createdFilmData.message;
      this.statuses.createFilm = DONE_STORE_STATUS;
    } catch {
      this.statuses.createFilm = ERROR_STORE_STATUS;
    }
  }

  *getFilms(
    limit: number,
    page: number,
    sortType: SortType,
    sortOrder: SortOrder
  ) {
    this.films = null;
    this.searchedFilms = null;
    this.statuses.getFilms = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FilmsResponse } = yield getFilms(
        limit,
        page,
        sortType,
        sortOrder
      );
      const films = {
        data: data.films,
        totalFilms: data.totalFilms,
        limit: data.limit,
        page: data.page,
      };
      this.films = films;
      this.statuses.getFilms = DONE_STORE_STATUS;
    } catch {
      this.statuses.getFilms = ERROR_STORE_STATUS;
    }
  }

  *deleteFilm(filmId: string, filmFilename: string) {
    this.films = null;
    this.statuses.deleteFilm = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FilmsResponse } = yield deleteFilm(
        filmId,
        filmFilename
      );
      const films = {
        data: data.films,
        totalFilms: data.totalFilms,
        limit: data.limit,
        page: data.page,
      };
      this.films = films;
      this.responseMessage = data.message;
      this.statuses.deleteFilm = DONE_STORE_STATUS;
    } catch {
      this.statuses.deleteFilm = ERROR_STORE_STATUS;
    }
  }

  *getFilmsByCategory(
    categoryId: string,
    limit: number,
    page: number,
    sortType: SortType,
    sortOrder: SortOrder
  ) {
    this.films = null;
    this.statuses.getFilmsByCategory = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FilmsResponse } = yield getFilmsByCategory(
        categoryId,
        limit,
        page,
        sortType,
        sortOrder
      );
      const films = {
        data: data.films,
        totalFilms: data.totalFilms,
        limit: data.limit,
        page: data.page,
      };
      this.filmsByCategory = films;
      this.statuses.getFilmsByCategory = DONE_STORE_STATUS;
    } catch {
      this.statuses.getFilmsByCategory = ERROR_STORE_STATUS;
    }
  }

  *getFilmById(filmId: string) {
    this.film = null;
    this.statuses.getFilmById = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FilmResponse } = yield getFilmById(filmId);
      this.film = data.film;
      this.statuses.getFilmById = DONE_STORE_STATUS;
    } catch {
      this.statuses.getFilmById = ERROR_STORE_STATUS;
    }
  }

  *likeFilm(filmId: string) {
    this.statuses.likeFilm = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FilmResponse } = yield likeFilm(filmId);
      this.film = data.film;
      this.statuses.likeFilm = DONE_STORE_STATUS;
    } catch {
      this.statuses.likeFilm = ERROR_STORE_STATUS;
    }
  }

  *dislikeFilm(filmId: string) {
    this.statuses.dislikeFilm = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FilmResponse } = yield dislikeFilm(filmId);
      this.film = data.film;
      this.statuses.dislikeFilm = DONE_STORE_STATUS;
    } catch {
      this.statuses.dislikeFilm = ERROR_STORE_STATUS;
    }
  }

  *getWatchLaterFilms(
    limit: number,
    page: number,
    sortType: SortType,
    sortOrder: SortOrder
  ) {
    this.films = null;
    this.statuses.getWatchLaterFilms = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FilmsResponse } = yield getWatchLaterFilms(
        limit,
        page,
        sortType,
        sortOrder
      );
      const films = {
        data: data.films,
        totalFilms: data.totalFilms,
        limit: data.limit,
        page: data.page,
      };
      this.films = films;
      this.statuses.getWatchLaterFilms = DONE_STORE_STATUS;
    } catch {
      this.statuses.getWatchLaterFilms = ERROR_STORE_STATUS;
    }
  }

  *getSearchedFilms(
    limit: number,
    page: number,
    searchedValue: string,
    sortType: SortType,
    sortOrder: SortOrder
  ) {
    this.films = null;
    this.searchedFilms = null;
    this.statuses.getSearchedFilms = PENDING_STORE_STATUS;
    try {
      const { data }: { data: FilmsResponse } = yield getSearchedFilms(
        limit,
        page,
        searchedValue,
        sortType,
        sortOrder
      );
      const films = {
        data: data.films,
        totalFilms: data.totalFilms,
        limit: data.limit,
        page: data.page,
      };
      this.searchedFilms = films;
      this.statuses.getSearchedFilms = DONE_STORE_STATUS;
    } catch {
      this.statuses.getSearchedFilms = ERROR_STORE_STATUS;
    }
  }
}

const manageFilmStore = new ManageFilmStore();

export default manageFilmStore;
