import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "@/consts";
import { Context, Next } from "koa";
import { NON_AUTHORIZED_REQUEST } from "@/consts/messages";
import mongoose from "mongoose";

export const auth = async (ctx: Context, next: Next) => {
  try {
    const token = ctx.request.headers?.authorization?.split(" ")?.[1] || null;
    if (token) {
      const decodedData = jwt.verify(token, SECRET_JWT_KEY);
      if (
        typeof decodedData !== "string" &&
        mongoose.Types.ObjectId.isValid(decodedData?.id)
      ) {
        ctx.request.body.userId = decodedData.id;
      } else {
        throw new Error(NON_AUTHORIZED_REQUEST);
      }
      await next();
    }
  } catch {
    ctx.response.status = 401;
    ctx.response.body = { message: NON_AUTHORIZED_REQUEST };
  }
};
