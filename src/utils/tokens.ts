import * as jwt from "jsonwebtoken";
import { env } from "../config/env";
export function signAccessToken(
  sub: string,
  role: "student" | "company" | "admin"
) {
  return jwt.sign({ sub, role }, env.jwt.accessSecret as jwt.Secret, {
    expiresIn: env.jwt.accessExpires as any,
  });
}
export function signRefreshToken(
  sub: string,
  role: "student" | "company" | "admin"
) {
  return jwt.sign(
    { sub, role, type: "refresh" },
    env.jwt.refreshSecret as jwt.Secret,
    {
      expiresIn: env.jwt.refreshExpires as any,
    }
  );
}
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.jwt.refreshSecret) as {
    sub: string;
    role: "student" | "company" | "admin";
    type: "refresh";
  };
}
