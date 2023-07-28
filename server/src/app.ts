import Koa from "koa";
import koaBody from "koa-body";
import koaBodyParser from "koa-bodyparser";
import authRouter from "@/router/auth";
import userRouter from "@/router/user";
import manageAdminsRouter from "@/router/manageAdmins";
import manageFilmsRouter from "@/router/manageFilms";
import manageCategoriesRouter from "@/router/manageCategories";
import manageCommentsRouter from "@/router/manageComments";
import manageActorsRouter from "@/router/manageActors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "@koa/cors";
import Grid from "gridfs-stream";
import { GridFSBucket } from "mongodb";

const app = new Koa();
dotenv.config();

app.use(cors());

app.use(koaBody({ jsonLimit: "10mb", textLimit: "10mb" }));
app.use(koaBodyParser({ jsonLimit: "10mb", textLimit: "10mb" }));
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(manageAdminsRouter.routes());
app.use(manageAdminsRouter.allowedMethods());
app.use(manageFilmsRouter.routes());
app.use(manageFilmsRouter.allowedMethods());
app.use(manageCategoriesRouter.routes());
app.use(manageCategoriesRouter.allowedMethods());
app.use(manageCommentsRouter.routes());
app.use(manageCommentsRouter.allowedMethods());
app.use(manageActorsRouter.routes());
app.use(manageActorsRouter.allowedMethods());

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGODB_URL || "";

export let gfs: Grid.Grid;
export let gridfsBucket: GridFSBucket;

mongoose
  .connect(MONGO_URL)
  .then(({ connection }) => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: "files",
    });
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection("files");
  })
  .catch((error) =>
    console.log(`Something went wrong while starting the server: ${error}`)
  );
