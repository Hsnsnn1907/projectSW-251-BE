import jwt from "jsonwebtoken";

const { JWT_SECRET, ACCESS_EXPIRES, REFRESH_EXPIRES } = process.env;

export function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES || "15m",
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES || "7d",
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}