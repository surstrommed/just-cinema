import { Schema, model } from "mongoose";
import { ObjectID } from "bson";

export interface IActorModel {
  _id: ObjectID;
  name: string;
  biography: string;
  image?: string;
  birthDay: number;
  birthPlace: string;
  height: number;
  genres: string[];
  likes: string[];
  dislikes: string[];
  rating: number;
  createdAt: number;
  updatedAt: number;
}

export interface IFormattedActor extends Omit<IActorModel, "_id"> {
  id: string;
}

export type SortActorType = "name" | "birthDay" | "rating";

export type SortActorOrder = "desc" | "asc";

const actorSchema = new Schema({
  name: { type: String, required: true },
  biography: { type: String, required: true },
  image: { type: String, default: null },
  birthDay: { type: Number, required: true },
  birthPlace: { type: String, required: true },
  height: { type: Number, required: true },
  genres: { type: [String], default: [] },
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
  updatedAt: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export default model<IActorModel>("Actor", actorSchema);
