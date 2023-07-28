import Router from "koa-router";
import {
  createAdmin,
  deleteAdmin,
  getAdmins,
} from "@/controllers/manageAdmins";
import { auth } from "@/middleware/auth";

const router = new Router();

router.post("/manageAdmins/createAdmin", auth, createAdmin);
router.get("/manageAdmins/getAdmins", auth, getAdmins);
router.delete("/manageAdmins/deleteAdmin/:adminId", auth, deleteAdmin);

export default router;
