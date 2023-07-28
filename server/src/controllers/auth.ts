import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "@/consts";
import UserModel from "@/models/user";
import { Context } from "koa";
import { USER_ROLE } from "@/consts/user";
import {
  INVALID_CREDENTIALS,
  SMT_WENT_WRONG,
  USER_ALREADY_EXIST,
  USER_DOES_NOT_EXIST,
} from "@/consts/messages";

export const signin = async (ctx: Context) => {
  const { email, password } = ctx.request.body;

  try {
    const userIsExisted = await UserModel.findOne({ email });
    if (!userIsExisted) {
      ctx.response.status = 404;
      ctx.response.body = { message: USER_DOES_NOT_EXIST };
    } else {
      const isPasswordCorrect =
        userIsExisted?.password &&
        (await bcrypt.compare(password, userIsExisted.password));

      if (!isPasswordCorrect) {
        ctx.response.status = 401;
        ctx.response.body = { message: INVALID_CREDENTIALS };
      } else {
        const token = jwt.sign(
          { email: userIsExisted?.email, id: userIsExisted?._id },
          SECRET_JWT_KEY,
          { expiresIn: "12h" }
        );

        ctx.response.status = 200;
        ctx.response.body = { user: userIsExisted, token };
      }
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: SMT_WENT_WRONG };
  }
};

export const signup = async (ctx: Context) => {
  const { email, password, name } = ctx.request.body;

  try {
    const userIsExisted = await UserModel.findOne({ email });
    if (userIsExisted) {
      ctx.response.status = 400;
      ctx.response.body = { message: USER_ALREADY_EXIST };
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      const createdUser = await UserModel.create({
        email,
        password: hashedPassword,
        name,
        image: "",
        role: USER_ROLE,
        createdAt: new Date().toISOString(),
      });

      const token = jwt.sign(
        { email: createdUser.email, id: createdUser._id },
        SECRET_JWT_KEY,
        { expiresIn: "12h" }
      );

      ctx.response.status = 200;
      ctx.response.body = { user: createdUser, token };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};
