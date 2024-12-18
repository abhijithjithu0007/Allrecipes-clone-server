import type { Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import Recipe from "../models/recipeSchema";
import { CustomRequest } from "../types/interface";

export const addRecipe = async (req: CustomRequest, res: Response) => {
  const {
    title,
    description,
    image = "",
    ingredients,
    directions,
    prepTime,
    servings,
    mealType,
    cuisine,
    notes = "",
  } = req.body;

  if (
    !title ||
    !description ||
    !ingredients ||
    !directions ||
    !prepTime ||
    !mealType ||
    !cuisine ||
    !servings
  ) {
    throw new CustomError("All fields are required", 400);
  }

  const recipe = await Recipe.create({
    title,
    description,
    image,
    ingredients,
    directions,
    prepTime,
    servings,
    notes,
    mealType,
    cuisine,
    createdBy: req.user?.id,
  });

  res
    .status(200)
    .json(new StandardResponse("Recipe added successfully", recipe));
};
