import { Context } from "koa";
import ActorModel, {
  IActorModel,
  SortActorOrder,
  SortActorType,
} from "@/models/actor";
import {
  ACTOR_ALREADY_EXIST,
  ACTOR_DOES_NOT_EXIST,
  SMT_WENT_WRONG,
  SUCCESSFULLY_ACTOR_CREATED,
  SUCCESSFULLY_ADMIN_DELETED,
} from "@/consts/messages";
import { getActorSort, getFormattedActor } from "@/utils";

export const createActor = async (ctx: Context) => {
  const { name, biography, birthDay, birthPlace, height } = ctx.request.body;

  try {
    const actorIsExisted = await ActorModel.findOne({ name });
    if (actorIsExisted) {
      ctx.response.status = 400;
      ctx.response.body = { message: ACTOR_ALREADY_EXIST };
    } else {
      const createdActor = await ActorModel.create({
        name,
        biography,
        birthDay,
        birthPlace,
        height,
        updatedAt: Date.parse(new Date().toString()),
        createdAt: Date.parse(new Date().toString()),
      });

      ctx.response.status = 200;
      ctx.response.body = {
        actor: createdActor,
        message: SUCCESSFULLY_ACTOR_CREATED,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getActors = async (ctx: Context) => {
  const { limit, page, sortType, sortOrder } = ctx.query;
  try {
    let skip: number,
      formattedLimit: number,
      actors: IActorModel[] = [],
      totalActors = 0;
    if (limit && page) {
      formattedLimit = Number(limit);
      skip = (Number(page) - 1) * formattedLimit;
      actors = await ActorModel.find()
        .sort(
          getActorSort(sortType as SortActorType, sortOrder as SortActorOrder)
        )
        .skip(skip)
        .limit(formattedLimit);
      totalActors = await ActorModel.countDocuments();
    }

    const formattedActors = actors.map((actor) => getFormattedActor(actor));

    ctx.response.status = 200;
    ctx.response.body = {
      actors: formattedActors,
      totalActors,
      limit: limit ? Number(limit) : null,
      page: page ? Number(page) : null,
    };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const deleteActor = async (ctx: Context) => {
  const { actorId } = ctx.params;

  try {
    const actorIsExisted = await ActorModel.findOne({ _id: actorId });
    if (!actorIsExisted) {
      ctx.response.status = 404;
      ctx.response.body = { message: ACTOR_DOES_NOT_EXIST };
    } else {
      await ActorModel.findByIdAndRemove(actorId);

      const totalActors = await ActorModel.countDocuments();
      const actors = await ActorModel.find();
      const formattedActors = actors.map((actor) => getFormattedActor(actor));

      ctx.response.status = 200;
      ctx.response.body = {
        message: SUCCESSFULLY_ADMIN_DELETED,
        users: formattedActors,
        totalActors,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};
