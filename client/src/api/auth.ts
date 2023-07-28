import { ISignInValues, ISignUpValues } from "models/auth";
import API from "./api";

export const signIn = (userData: ISignInValues) =>
  API.post("/signin", userData);
export const signUp = (userData: ISignUpValues) =>
  API.post("/signup", userData);
