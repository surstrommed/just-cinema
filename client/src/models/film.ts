import { FilmCategory } from "./category";

export interface IFilm {
  id: string;
  title: string;
  creator: string;
  description: string;
  year: number;
  fileID: string;
  filename: string;
  category: string;
  thumbnail: string;
  views: number;
  likes: string[];
  dislikes: string[];
  rating: number;
  createdAt: number;
  updatedAt: number;
}

export interface IFilmWithCategory extends IFilm {
  categoryInfo: FilmCategory;
}

export interface IFilmInput {
  handleFilmUpload: (state: FormData) => void;
}

export interface IUploadedVideoFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  id: string;
  filename: string;
  metadata: unknown;
  bucketName: string;
  chunkSize: number;
  size: number;
  uploadDate: string;
  contentType: string;
}

export interface IFilmCard {
  watchLater?: boolean;
  film: IFilmWithCategory;
  handleFilmUpdate?: () => void;
}

export interface IFilmCategory {
  categoryId: string;
}

export interface StoredFilmsData {
  data: IFilmWithCategory[];
  totalFilms: number;
  page: number | null;
  limit: number | null;
}

export interface IUploadFilmValues {
  creator: string;
  title: string;
  description: string;
  year: number;
  category: string;
  views: number;
  thumbnail: string | null;
}

export interface ICreateFilmFormValues extends IUploadFilmValues {
  fileID: string;
  filename: string;
}

export interface IManageFilmFormValues {
  title: string;
  description: string;
  category: string;
  year: string;
}

export interface FilmsResponse {
  films: IFilmWithCategory[];
  totalFilms: number;
  limit: number | null;
  page: number | null;
  message: string;
}

export interface FilmResponse {
  film: IFilmWithCategory;
  message: string;
}

export interface UploadedFilmResponse {
  file: IUploadedVideoFile;
  message: string;
}

export interface CreatedFilmResponse {
  film: IFilmWithCategory;
  message: string;
}

export interface FileResponse {
  url: string;
  data: unknown;
}
