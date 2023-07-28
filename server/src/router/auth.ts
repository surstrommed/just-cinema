import Router from "koa-router";
import { signin, signup } from "@/controllers/auth";
import compose from "koa-compose";

const router = new Router();

router.post("/signin", compose([]), signin);
router.post("/signup", compose([]), signup);

export default router;
