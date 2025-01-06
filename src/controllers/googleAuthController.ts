import type { Request, Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import User from "../models/usersSchema";
import jwt from "jsonwebtoken";

export const googleRegister = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!email) {
    throw new CustomError("All fields are required", 400);
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }
  const newUser = new User({ name, email });
  await newUser.save();
  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET_KEY || "",
    {
      expiresIn: "1d",
    }
  );
  res.cookie("user", JSON.stringify({ id: newUser._id, token: token }), {
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json(new StandardResponse("User registered successfully"));
};

export const googleLogin = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError("Email is required", 400);
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("User not found! Please register", 404);
    } else {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY || "",
        {
          expiresIn: "1d",
        }
      );
      res.cookie("user", JSON.stringify({ id: user._id, token: token }), {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json(new StandardResponse("User logged in successfully"));
    }
  }
};
