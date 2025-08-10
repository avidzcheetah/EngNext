import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
export interface AuthPayload {
  sub: string;
  role: "student" | "company" | "admin";
}
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  const token = header.substring(7);
  try {
    const payload = jwt.verify(token, env.jwt.accessSecret) as AuthPayload;
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
export function requireRole(...roles: AuthPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthPayload | undefined;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
