import { Schema, model } from "mongoose";

export interface ICategoryModel {
  _id: Schema.Types.ObjectId;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export interface ICategory extends Omit<ICategoryModel, "_id"> {
  id: string;
}

const categorySchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  _id: { type: Schema.Types.ObjectId },
});

export default model<ICategoryModel>("Category", categorySchema);
