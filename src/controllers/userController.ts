import type { Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import { CustomRequest } from "../types/interface";
import User from "../models/usersSchema";

export const getUserProfile = async (req: CustomRequest, res: Response) => {
  const user = req.user?.id;

  if (!user) {
    throw new CustomError("User id not found", 404);
  }

  const userProfile = await User.findById(user);
  if (!userProfile) {
    throw new CustomError("User data not found", 404);
  }

  res
    .status(200)
    .json(
      new StandardResponse("User profile fetched successfully", userProfile)
    );
};

export const updateUserProfile = async (req: CustomRequest, res: Response) => {
  const user = req.user?.id;
  const { name, profileImage = "" } = req.body;

  if (!user) {
    throw new CustomError("User id not found", 404);
  }

  const userProfile = await User.findById(user);
  if (!userProfile) {
    throw new CustomError("User data not found", 404);
  }

  userProfile.name = name;
  userProfile.profileImage = profileImage;
  await userProfile.save();

  res
    .status(200)
    .json(new StandardResponse("User profile updated successfully"));
};
