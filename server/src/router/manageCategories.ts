import Router from "koa-router";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} from "@/controllers/manageCategories";
import { auth } from "@/middleware/auth";
import compose from "koa-compose";

const router = new Router();

router.post("/manageCategories/createCategory", auth, createCategory);
router.get("/manageCategories/getCategories", compose([]), getCategories);
router.get(
  "/manageCategories/getCategoryById/:categoryId",
  compose([]),
  getCategoryById
);
router.delete(
  "/manageCategories/deleteCategory/:categoryId",
  auth,
  deleteCategory
);

export default router;
