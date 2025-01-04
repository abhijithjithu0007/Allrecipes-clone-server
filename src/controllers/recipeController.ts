import type { Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import Recipe from "../models/recipeSchema";
import { CustomRequest } from "../types/interface";
import User from "../models/usersSchema";
import axios from "axios";

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

export const getRecipeById = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  res
    .status(200)
    .json(new StandardResponse("Recipe fetched successfully", recipe));
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
    .select("title cuisine mealType _id");
  res
    .status(200)
    .json(new StandardResponse("Recipes fetched successfully", recipes));
};

export const saveRecipe = async (req: CustomRequest, res: Response) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new CustomError("Recipe not found", 404);
  }

  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (user.savedRecipes.includes(recipeId)) {
    throw new CustomError("Recipe already saved", 400);
  }

  user.savedRecipes.push(recipeId);
  await user.save();

  res.status(200).json(new StandardResponse("Recipe saved successfully"));
};

export const getSavedRecipes = async (req: CustomRequest, res: Response) => {
  const userSaved = await User.findById(req.user?.id).populate("savedRecipes");
  if (!userSaved) {
    throw new CustomError("User not found", 404);
  }

  res
    .status(200)
    .json(
      new StandardResponse(
        "Saved recipes fetched successfully",
        userSaved.savedRecipes
      )
    );
};

export const deleteSavedRecipe = async (req: CustomRequest, res: Response) => {
  const { recipeId } = req.params;

  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (!user.savedRecipes.includes(recipeId)) {
    throw new CustomError("Recipe not saved", 400);
  }
  const removeRecipe = user.savedRecipes.filter(
    (recipe) => recipe !== recipeId
  );
  user.savedRecipes = removeRecipe;
  await user.save();

  res.status(200).json(new StandardResponse("Recipe removed successfully"));
};

export const getNutritionOfRecipe = async (
  req: CustomRequest,
  res: Response
) => {
  const { recipeId } = req.params;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
    throw new CustomError("Recipe not found or no ingredients found", 404);
  }
  const RequestBody = {
    ingr: recipe.ingredients || "",
  };

  const response = await axios.post(
    "https://api.edamam.com/api/nutrition-details",
    RequestBody,
    {
      params: {
        app_id: process.env.EDAMAM_APP_ID,
        app_key: process.env.EDAMAM_APP_KEY,
      },
    }
  );

  res
    .status(200)
    .json(
      new StandardResponse("Nutrition fetched successfully", response.data)
    );
};
