import { Schema, model, Types } from "mongoose";
import { IUser } from "./user";

export interface ICommentModel {
  _id: Types.ObjectId;
  body: string;
  parentId: string | null;
  filmId: string;
  userId: string;
  updatedAt: number;
  createdAt: number;
}

export interface IComment extends Omit<ICommentModel, "_id"> {
  id: string;
}

export interface ICommentReply {
  user: IUser | null;
  comment: IComment;
}

export const commentSchema = new Schema({
  body: { type: String, required: true },
  userId: { type: String, required: true },
  parentId: { type: String },
  filmId: { type: String, required: true },
  updatedAt: { type: Number, required: true },
  createdAt: { type: Number, required: true },
});

export default model<ICommentModel>("Comment", commentSchema);
