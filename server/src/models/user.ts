import { ADMIN_ROLE, SUPER_ADMIN_ROLE, USER_ROLE } from "@/consts/user";
import { Schema, model, Types } from "mongoose";

export interface IUserModel {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
  image?: string;
  password?: string;
  watchLater: string[];
  createdAt: string;
}

export interface IUser extends Omit<IUserModel, "_id"> {
  id: string;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String },
  password: { type: String },
  watchLater: { type: [String], default: [], required: true },
  createdAt: { type: String, required: true },
  _id: { type: Schema.Types.ObjectId },
});

export default model("User", userSchema);

export type UserRole =
  | typeof USER_ROLE
  | typeof ADMIN_ROLE
  | typeof SUPER_ADMIN_ROLE;

export interface DecodedUserData {
  email: string;
  exp: number;
  iat: number;
  id: string;
}

export interface IProfileUpdateValues {
  name?: string;
  email?: string;
  image?: string | null;
}
