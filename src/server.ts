import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { applySecurity } from "./middleware/security";
import { notFound, errorHandler } from "./middleware/error";
import routes from "./routes";
async function bootstrap() {
  await connectDB();
  const app = express();
  applySecurity(app);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use("/api", routes);
  app.use(notFound);
  app.use(errorHandler);
  app.listen(env.port, () => {
    console.log("Server listening on http://localhost:${env.port}");
  });
}
bootstrap().catch((e) => {
  console.error("Fatal bootstrap error", e);
  process.exit(1);
});
