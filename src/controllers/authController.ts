import type { Request, Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import User from "../models/usersSchema";

export const register = async (req: Request, res: Response) => {
  const { name, email, profileImage = "" } = req.body;

  if (!name || !email) {
    throw new CustomError("All fields are required", 400);
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }
  const newUser = new User({ name, email, profileImage });
  await newUser.save();

  res.status(200).json(new StandardResponse("User registered successfully"));
};
