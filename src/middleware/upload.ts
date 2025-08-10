import multer from "multer";
import { env } from "../config/env";
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: env.uploads.maxCvMb * 1024 * 1024 },
});
