import { Context } from "koa";
import CategoryModel from "@/models/category";
import {
  NOT_FOUND_CATEGORY_WITH_ID,
  SMT_WENT_WRONG,
  SUCCESSFULLY_CATEGORY_CREATED,
  SUCCESSFULLY_CATEGORY_DELETED,
  CATEGORY_ALREADY_EXIST,
} from "@/consts/messages";
import mongoose from "mongoose";
import { getFormattedCategory } from "@/utils";

export const createCategory = async (ctx: Context) => {
  const { name } = ctx.request.body;

  try {
    const categoryIsExisted = await CategoryModel.findOne({ name });
    if (categoryIsExisted) {
      ctx.response.status = 400;
      ctx.response.body = { message: CATEGORY_ALREADY_EXIST };
    } else {
      const createdCategory = await CategoryModel.create({
        name,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      ctx.response.status = 200;
      ctx.response.body = {
        category: getFormattedCategory(createdCategory),
        message: SUCCESSFULLY_CATEGORY_CREATED,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getCategories = async (ctx: Context) => {
  try {
    const totalCategories = await CategoryModel.countDocuments();
    const categories = await CategoryModel.find();
    const formattedCategories = categories.map((category) =>
      getFormattedCategory(category)
    );

    ctx.response.status = 200;
    ctx.response.body = { categories: formattedCategories, totalCategories };
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const deleteCategory = async (ctx: Context) => {
  const { categoryId } = ctx.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      ctx.response.status = 404;
      ctx.response.body = { message: NOT_FOUND_CATEGORY_WITH_ID };
    } else {
      await CategoryModel.findByIdAndRemove(categoryId);

      const totalCategories = await CategoryModel.countDocuments();
      const categories = await CategoryModel.find();
      const formattedCategories = categories.map((category) =>
        getFormattedCategory(category)
      );

      ctx.response.status = 200;
      ctx.response.body = {
        message: SUCCESSFULLY_CATEGORY_DELETED,
        categories: formattedCategories,
        totalCategories,
      };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};

export const getCategoryById = async (ctx: Context) => {
  const { categoryId } = ctx.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      ctx.response.status = 404;
      ctx.response.body = { message: NOT_FOUND_CATEGORY_WITH_ID };
    } else {
      const category = await CategoryModel.findOne({ _id: categoryId });

      ctx.response.status = 200;
      ctx.response.body = { category };
    }
  } catch {
    ctx.response.status = 500;
    ctx.response.body = {
      message: SMT_WENT_WRONG,
    };
  }
};
