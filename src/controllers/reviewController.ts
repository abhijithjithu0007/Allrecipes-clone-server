import type { Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import { CustomRequest } from "../types/interface";
import Recipe from "../models/recipeSchema";
import Review from "../models/reviewSchema";

export const addReview = async (req: CustomRequest, res: Response) => {
  const { recipeId, rating, notes = "" } = req.body;

  if (!recipeId || !rating) {
    throw new CustomError("All fields are required", 400);
  }

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new CustomError("Recipe not found", 404);
  }

  const review = new Review({
    recipe: recipeId,
    user: req.user?.id,
    rating,
    notes,
  });

  await review.save();

  res
    .status(200)
    .json(new StandardResponse("Review added successfully", review));
};
