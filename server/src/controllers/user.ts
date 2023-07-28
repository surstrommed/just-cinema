import { Context } from "koa";
import UserModel, { IProfileUpdateValues } from "@/models/user";
import FilmModel from "@/models/film";
import {
  FILM_DOES_NOT_EXIST,
  NON_AUTHORIZED_REQUEST,
  SMT_WENT_WRONG,
  USER_DOES_NOT_EXIST,
} from "@/consts/messages";

export const getMyUser = async (ctx: Context) => {
  const userId = ctx.request.body.userId || null;
  try {
    if (userId) {
      const myUser = await UserModel.findOne({ _id: userId });

      if (!myUser) {
        ctx.response.status = 404;
        ctx.response.body = { message: USER_DOES_NOT_EXIST };
      } else {
        const formattedUser = {
          id: myUser._id,
          name: myUser.name,
          email: myUser.email,
          image: myUser.image,
          watchLater: myUser.watchLater,
          role: myUser.role,
          createdAt: myUser.createdAt,
        };
        ctx.response.status = 200;
        ctx.response.body = formattedUser;
      }
    } else {
      ctx.response.status = 401;
      ctx.response.body = { message: NON_AUTHORIZED_REQUEST };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: SMT_WENT_WRONG };
  }
};

export const updateUserData = async (ctx: Context) => {
  const userData = ctx.request.body;
  const userId = ctx.params?.userId;

  try {
    if (!userId) {
      ctx.response.status = 401;
      ctx.response.body = { message: NON_AUTHORIZED_REQUEST };
    } else {
      const userIsExisted = await UserModel.findOne({ _id: userId });

      if (!userIsExisted) {
        ctx.response.status = 404;
        ctx.response.body = { message: USER_DOES_NOT_EXIST };
      } else {
        const formattedUser: IProfileUpdateValues = {};
        if (userData?.name) {
          formattedUser.name = userData.name;
        }
        if (userData?.email) {
          formattedUser.email = userData.email;
        }
        if (typeof userData?.image === "string") {
          formattedUser.image = userData.image;
        }
        await UserModel.findByIdAndUpdate(userId, formattedUser, { new: true });
        const updatedUser = await UserModel.findOne({ _id: userId });

        ctx.response.status = 200;
        ctx.response.body = updatedUser;
      }
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: SMT_WENT_WRONG };
  }
};

export const manageFilmFromWatchLater = async (ctx: Context) => {
  const { userId } = ctx.request.body;
  const { filmId } = ctx.params;

  try {
    if (!userId) {
      ctx.response.status = 401;
      ctx.response.body = { message: NON_AUTHORIZED_REQUEST };
    } else {
      const userIsExisted = await UserModel.findOne({ _id: userId });
      const filmIsExisted = await FilmModel.findOne({ _id: filmId });

      if (!userIsExisted) {
        ctx.response.status = 404;
        ctx.response.body = { message: USER_DOES_NOT_EXIST };
      } else if (!filmIsExisted) {
        ctx.response.status = 404;
        ctx.response.body = { message: FILM_DOES_NOT_EXIST };
      } else {
        const watchLater = [...(userIsExisted.watchLater || [])];
        let editedWatchLater: string[] = [];
        if (watchLater.includes(filmId)) {
          editedWatchLater = watchLater.filter((id) => id !== filmId);
        } else {
          editedWatchLater = [...(userIsExisted.watchLater || []), filmId];
        }
        await UserModel.findByIdAndUpdate(
          userId,
          { watchLater: editedWatchLater },
          { new: true }
        );
        const updatedUser = await UserModel.findOne({ _id: userId });

        ctx.response.status = 200;
        ctx.response.body = updatedUser;
      }
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = { message: SMT_WENT_WRONG };
  }
};
