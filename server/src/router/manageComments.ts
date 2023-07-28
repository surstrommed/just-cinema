import Router from "koa-router";
import {
  createComment,
  updateComment,
  deleteComment,
  getFilmComments,
} from "@/controllers/manageComments";
import { auth } from "@/middleware/auth";
import compose from "koa-compose";

const router = new Router();

router.post("/manageComments/createComment", auth, createComment);
router.patch("/manageComments/updateComment", auth, updateComment);
router.delete("/manageComments/deleteComment/:commentId", auth, deleteComment);
router.get(
  "/manageComments/getFilmComments/:filmId",
  compose([]),
  getFilmComments
);

export default router;
