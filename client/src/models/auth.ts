import { IUser } from "./user";

export interface ISignInValues {
  email: string;
  password: string;
}

export interface ISignUpValues {
  name: string;
  email: string;
  password: string;
}

export interface IGoogleSignInValues {
  email: string;
  name: string;
  token: string;
  googleId: string;
}

export type ISignInFormValues = ISignInValues;

export interface ISignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: IUser;
}
