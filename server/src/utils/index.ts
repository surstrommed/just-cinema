import jwt_decode from "jwt-decode";
import { DecodedUserData, IUser, IUserModel } from "@/models/user";
import { ICommentModel, IComment } from "@/models/comment";
import {
  IOriginalFilm,
  IFormattedFilm,
  SortFilmType,
  SortFilmOrder,
} from "@/models/film";
import { ICategory, ICategoryModel } from "@/models/category";
import { SortOrder } from "mongoose";
import { IActorModel, IFormattedActor, SortActorType } from "@/models/actor";

export const getDecodedTokenData = (token: string) =>
  jwt_decode<DecodedUserData>(token);

export const getFormattedComment = (comment: ICommentModel): IComment => ({
  id: String(comment._id),
  body: comment.body,
  parentId: comment.parentId,
  filmId: comment.filmId,
  userId: comment.userId,
  updatedAt: comment.updatedAt,
  createdAt: comment.createdAt,
});

export const getFormattedPage = (
  currentPage: string | string[] | undefined,
  limit: number,
  totalElements: number
) =>
  currentPage
    ? Number(currentPage) > Math.ceil(totalElements / limit)
      ? Math.ceil(totalElements / limit)
      : Number(currentPage)
    : null;

export const getFormattedUser = (user: IUserModel): IUser => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image,
  watchLater: user.watchLater,
  createdAt: user.createdAt,
});

export const getFormattedFilm = (film: IOriginalFilm): IFormattedFilm => ({
  id: String(film._id),
  creator: String(film.creator),
  title: film.title,
  description: film.description,
  year: film.year,
  fileID: String(film.fileID),
  filename: film.filename,
  category: String(film.category),
  views: film.views,
  likes: film.likes,
  dislikes: film.dislikes,
  rating: film.rating,
  thumbnail: film.thumbnail,
  createdAt: film.createdAt,
  updatedAt: film.updatedAt,
});

export const getFormattedCategory = (category: ICategoryModel): ICategory => ({
  id: String(category._id),
  name: category.name,
  updatedAt: category.updatedAt,
  createdAt: category.createdAt,
});

export const getFormattedActor = (actor: IActorModel): IFormattedActor => ({
  id: String(actor._id),
  name: actor.name,
  biography: actor.biography,
  image: actor.image,
  birthDay: actor.birthDay,
  birthPlace: actor.birthPlace,
  height: actor.height,
  genres: actor.genres,
  likes: actor.likes,
  dislikes: actor.dislikes,
  rating: actor.rating,
  updatedAt: actor.updatedAt,
  createdAt: actor.createdAt,
});

export const getFilmSort = (
  sortType: SortFilmType,
  sortOrder: SortFilmOrder
): { [key: string]: SortOrder } => {
  if (sortType && sortOrder) {
    let key;
    let value;
    switch (sortType) {
      case "upload":
        key = "createdAt";
        break;
      case "year":
        key = "year";
        break;
      case "rating":
        key = "rating";
        break;
    }
    switch (sortOrder) {
      case "desc":
        value = -1;
        break;
      case "asc":
        value = 1;
        break;
    }
    return { [key]: value as SortOrder };
  } else {
    return { createdAt: -1 as SortOrder };
  }
};

export const getActorSort = (
  sortType: SortActorType,
  sortOrder: SortFilmOrder
): { [key: string]: SortOrder } => {
  if (sortType && sortOrder) {
    let key;
    let value;
    switch (sortType) {
      case "name":
        key = "name";
        break;
      case "birthDay":
        key = "birthDay";
        break;
      case "rating":
        key = "rating";
        break;
    }
    switch (sortOrder) {
      case "desc":
        value = -1;
        break;
      case "asc":
        value = 1;
        break;
    }
    return { [key]: value as SortOrder };
  } else {
    return { name: 1 as SortOrder };
  }
};
