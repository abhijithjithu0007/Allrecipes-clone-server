import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: {
    id: string;
  } & JwtPayload;
}

export type JwtDecoded = {
  id: string;
  role: "user" | "admin";
};
