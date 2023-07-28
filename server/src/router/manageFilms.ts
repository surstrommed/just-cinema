import Router from "koa-router";
import {
  createFilm,
  deleteFilm,
  getFilmByFilename,
  getFilmById,
  getFilms,
  getFilmsByCategory,
  getSearchedFilms,
  getWatchLaterFilms,
  manageFilmDislike,
  manageFilmLike,
  uploadFilm,
} from "@/controllers/manageFilms";
import { auth } from "@/middleware/auth";
import { upload } from "@/middleware/uploadFilm";
import compose from "koa-compose";

const router = new Router();

router.post(
  "/manageFilms/uploadFilm",
  compose([auth, upload.single("file")]),
  uploadFilm
);
router.post("/manageFilms/createFilm", auth, createFilm);
router.get("/manageFilms/getFilms", compose([]), getFilms);
router.get(
  "/manageFilms/getFilmsByCategory/:categoryId",
  compose([]),
  getFilmsByCategory
);
router.get("/manageFilms/getFilmById/:filmId", compose([]), getFilmById);
router.delete("/manageFilms/deleteFilm/:filmId/:filename", auth, deleteFilm);
router.get(
  "/manageFilms/getFilmByFilename/:filename",
  compose([]),
  getFilmByFilename
);
router.patch("/manageFilms/manageFilmLike/:filmId", auth, manageFilmLike);
router.patch("/manageFilms/manageFilmDislike/:filmId", auth, manageFilmDislike);
router.get("/manageFilms/watchLaterFilms", auth, getWatchLaterFilms);
router.get("/manageFilms/searchFilms", compose([]), getSearchedFilms);

export default router;
