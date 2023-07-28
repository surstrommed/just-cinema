import Router from "koa-router";
import {
  createActor,
  deleteActor,
  getActors,
} from "@/controllers/manageActors";
import { auth } from "@/middleware/auth";
import compose from "koa-compose";

const router = new Router();

router.post("/manageActors/createActor", auth, createActor);
router.get("/manageActors/getActors", compose([]), getActors);
router.delete("/manageActors/deleteActor/:actorId", auth, deleteActor);

export default router;
