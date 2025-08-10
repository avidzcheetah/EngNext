import { Request, Response } from "express";
import { register, login } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validators";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/tokens";
export async function registerHandler(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const user = await register(parsed.data);
  return res
    .status(201)
    .json({ id: user.id, email: user.email, role: user.role });
}
export async function loginHandler(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const user = await login(parsed.data);
  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.json({
    accessToken,
    user: { id: user.id, email: user.email, role: user.role },
  });
}
export async function refreshHandler(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: "Missing refresh token" });
  try {
    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken(payload.sub, payload.role);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
}
export async function logoutHandler(_req: Request, res: Response) {
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
  return res.json({ ok: true });
}
