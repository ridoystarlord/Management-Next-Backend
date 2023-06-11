import dotenv from "dotenv";
dotenv.config();

export const DB = process.env.DATABASE!;
export const PORT = process.env.PORT!;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const JWT_SECRET_KEY_TOKEN_EXPIRED =
  process.env.JWT_SECRET_KEY_TOKEN_EXPIRED!;
