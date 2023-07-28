import Router from "koa-router";
import {
  getMyUser,
  manageFilmFromWatchLater,
  updateUserData,
} from "@/controllers/user";
import { auth } from "@/middleware/auth";

const router = new Router();

router.get("/myuser", auth, getMyUser);
router.patch("/users/:userId", auth, updateUserData);
router.patch(
  "/users/manageFilmFromWatchLater/:filmId",
  auth,
  manageFilmFromWatchLater
);

export default router;
