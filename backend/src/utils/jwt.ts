import jwt from "jsonwebtoken";
import env from "../config/env";

// Ensure JWT_SECRET is always a string at runtime
if (!env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET is missing in environment variables");
}

// Explicitly cast it so TypeScript knows it's valid
const JWT_SECRET = env.JWT_SECRET as string;

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
