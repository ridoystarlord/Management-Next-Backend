import jwt from "jsonwebtoken";

import { JWT_SECRET_KEY, JWT_SECRET_KEY_TOKEN_EXPIRED } from "../Config";

export const generateJWTToken = async (_id: string): Promise<string> => {
  return jwt.sign({ _id: _id }, JWT_SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: JWT_SECRET_KEY_TOKEN_EXPIRED,
  });
};

export const verifyToken = async (token: string): Promise<string> => {
  return jwt.verify(token, JWT_SECRET_KEY) as string;
};
