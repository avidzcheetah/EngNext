import "dotenv/config";
const required = (name: string, value?: string) => {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required("MONGO_URI", process.env.MONGO_URI),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET", process.env.JWT_ACCESS_SECRET),
    refreshSecret: required(
      "JWT_REFRESH_SECRET",
      process.env.JWT_REFRESH_SECRET
    ),
    accessExpires: process.env.JWT_ACCESS_EXPIRES ?? "15m",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES ?? "7d",
  },
  uploads: {
    maxCvMb: Number(process.env.MAX_CV_FILE_MB ?? 5),
    allowedImages: (
      process.env.ALLOWED_IMAGE_TYPES ?? "image/png,image/jpeg,image/webp"
    ).split(","),
    allowedCv: (process.env.ALLOWED_CV_TYPES ?? "application/pdf").split(","),
  },
};
