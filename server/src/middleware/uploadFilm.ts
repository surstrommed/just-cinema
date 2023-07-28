import multer from "@koa/multer";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import path from "path";

const storage = new GridFsStorage({
  url: "mongodb+srv://surstrommed:surstrommed@cluster0.htrocy2.mongodb.net/?retryWrites=true&w=majority",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "files",
        };
        resolve(fileInfo);
      });
    });
  },
});
export const upload = multer({ storage });
