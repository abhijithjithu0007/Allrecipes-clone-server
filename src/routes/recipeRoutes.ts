import express from "express";

import { validateData } from "../middlewares/zodValidation";
import { addRecipeSchema } from "../utils/zodSchema";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/errors/errorCatch";
import {
  addRecipe,
  deleteSavedRecipe,
  getAllRecipes,
  getNutritionOfRecipe,
  getRecipeByCuisine,
  getRecipeById,
  getRecipeByIngredients,
  getRecipeByMeals,
  getSavedRecipes,
  saveRecipe,
  searchRecipe,
} from "../controllers/recipeController";

const router = express.Router();

router.post(
  "/add-recipe",
  verifyToken,
  validateData(addRecipeSchema),
  errorCatch(addRecipe)
);
router.get("/get-all-recipes", errorCatch(getAllRecipes));
router.get("/get-recipe-by-id/:id", errorCatch(getRecipeById));
router.get("/get-recipe-by-meals/:mealType", errorCatch(getRecipeByMeals));

router.get(
  "/get-recipe-by-ingredient/:ingredient",
  errorCatch(getRecipeByIngredients)
);
router.get("/get-recipe-by-cuisine/:cuisine", errorCatch(getRecipeByCuisine));

router.get("/search-recipe/:query", errorCatch(searchRecipe));

router.post("/save-recipe/:recipeId", verifyToken, errorCatch(saveRecipe));

router.get("/get-saved-recipes", verifyToken, errorCatch(getSavedRecipes));

router.delete(
  "/delete-saved-recipe/:recipeId",
  verifyToken,
  errorCatch(deleteSavedRecipe)
);

router.get("/get-recipe-nutrition/:recipeId", errorCatch(getNutritionOfRecipe));

export default router;
