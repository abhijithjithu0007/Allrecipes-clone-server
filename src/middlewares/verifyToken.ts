import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { CustomRequest, JwtDecoded } from "../types/interface";
import { CustomError } from "../utils/errors/customError";
import User from "../models/usersSchema";

export const verifyToken = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userCookie = req.cookies?.user ? JSON.parse(req.cookies.user) : null;

    const token: string = userCookie?.token;

    if (!token) {
      throw new CustomError("You are not authenticated ! Please login", 401);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
    req.user = verified as JwtDecoded;
    const userExists = await User.findById(req.user.id);
    if (!userExists) {
      throw new CustomError("User not found", 404);
    }
    next();
  } catch (error) {
    next(error);
  }
};
