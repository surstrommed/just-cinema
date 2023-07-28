import { ObjectID } from "bson";
import { Schema, model } from "mongoose";
import { ICategory } from "./category";

export interface FilmFields {
  title: string;
  description: string;
  year: number;
  filename: string;
  thumbnail: string;
  views: number;
  likes: string[];
  dislikes: string[];
  rating: number;
  createdAt: number;
  updatedAt: number;
}

export interface IOriginalFilm extends FilmFields {
  _id: ObjectID;
  creator: ObjectID;
  category: ObjectID;
  fileID: ObjectID;
}

export interface IFormattedFilm extends FilmFields {
  id: string;
  creator: string;
  category: string;
  fileID: string;
}

export interface IFilmWithCategory extends IFormattedFilm {
  categoryInfo: ICategory | null;
}

export type SortFilmType = "upload" | "year" | "rating";

export type SortFilmOrder = "desc" | "asc";

const filmSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, maxlength: 50, required: true },
  description: { type: String, required: true },
  year: {
    type: Number,
    required: true,
  },
  fileID: {
    type: Schema.Types.ObjectId,
    ref: "Files",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: [String],
    default: [],
  },
  dislikes: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
  _id: { type: Schema.Types.ObjectId },
});

export default model<IOriginalFilm>("Film", filmSchema);
