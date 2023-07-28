import { Context } from "koa";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import { ADMIN_ROLE } from "@/consts/user";
import {
  NOT_FOUND_ADMIN_WITH_ID,
  SMT_WENT_WRONG,
  SUCCESSFULLY_ADMIN_CREATED,
  SUCCESSFULLY_ADMIN_DELETED,
  USER_ALREADY_EXIST,
} from "@/consts/messages";
import mongoose from "mongoose";
import { getFormattedUser } from "@/utils";

export const createAdmin = async (ctx: Context) => {
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
        role: ADMIN_ROLE,
        createdAt: new Date().toISOString(),
      });

      ctx.response.status = 200;
      ctx.response.body = {
        user: createdUser,
        message: SUCCESSFULLY_ADMIN_CREATED,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getAdmins = async (ctx: Context) => {
  try {
    const totalAdmins = await UserModel.countDocuments({ role: ADMIN_ROLE });
    const admins = await UserModel.find({ role: ADMIN_ROLE });

    const formattedAdmins = admins.map((admin) => getFormattedUser(admin));

    ctx.response.status = 200;
    ctx.response.body = { users: formattedAdmins, totalAdmins };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const deleteAdmin = async (ctx: Context) => {
  const { adminId } = ctx.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      ctx.response.status = 404;
      ctx.response.body = { message: NOT_FOUND_ADMIN_WITH_ID };
    } else {
      await UserModel.findByIdAndRemove(adminId);

      const totalAdmins = await UserModel.countDocuments({ role: ADMIN_ROLE });
      const admins = await UserModel.find({ role: ADMIN_ROLE });
      const formattedAdmins = admins.map((admin) => getFormattedUser(admin));

      ctx.response.status = 200;
      ctx.response.body = {
        message: SUCCESSFULLY_ADMIN_DELETED,
        users: formattedAdmins,
        totalAdmins,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};
