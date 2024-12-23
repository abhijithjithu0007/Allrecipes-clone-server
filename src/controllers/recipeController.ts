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

export const getRecipeByMeals = async (req: CustomRequest, res: Response) => {
  const { mealType } = req.params;

  const recipes = await Recipe.find({ mealType });
  res
    .status(200)
    .json(new StandardResponse("Recipes fetched successfully", recipes));
};

export const getRecipeByIngredients = async (
  req: CustomRequest,
  res: Response
) => {
  const { ingredient } = req.params;

  const recipes = await Recipe.find({
    ingredients: {
      $elemMatch: {
        $regex: ingredient,
        $options: "i",
      },
    },
  });

  if (!recipes.length) {
    res
      .status(404)
      .json({ message: "No recipes found with the given ingredient" });
  }

  res
    .status(200)
    .json(new StandardResponse("Recipes fetched successfully", recipes));
};

export const getRecipeByCuisine = async (req: CustomRequest, res: Response) => {
  const { cuisine } = req.params;
  const recipes = await Recipe.find({ cuisine });
  res
    .status(200)
    .json(new StandardResponse("Recipes fetched successfully", recipes));
};

export const getAllRecipes = async (req: CustomRequest, res: Response) => {
  const recipes = await Recipe.find();
  res
    .status(200)
    .json(new StandardResponse("Recipes fetched successfully", recipes));
};

export const searchRecipe = async (req: CustomRequest, res: Response) => {
  const { query } = req.params;
  const recipes = await Recipe.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { cuisine: { $regex: query, $options: "i" } },
      { mealType: { $regex: query, $options: "i" } },
    ],
  })
    .limit(10)
    .select("title cuisine mealType");
  res
    .status(200)
    .json(new StandardResponse("Recipes fetched successfully", recipes));
};
