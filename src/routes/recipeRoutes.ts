import express from "express";

import { validateData } from "../middlewares/zodValidation";
import { addRecipeSchema } from "../utils/zodSchema";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/errors/errorCatch";
import {
  addRecipe,
  getRecipeByCuisine,
  getRecipeByIngredients,
  getRecipeByMeals,
} from "../controllers/recipeController";

const router = express.Router();

router.post(
  "/add-recipe",
  verifyToken,
  validateData(addRecipeSchema),
  errorCatch(addRecipe)
);
router.get(
  "/get-recipe-by-meals/:mealType",
  verifyToken,
  errorCatch(getRecipeByMeals)
);

router.get(
  "/get-recipe-by-ingredient/:ingredient",
  verifyToken,
  errorCatch(getRecipeByIngredients)
);
router.get(
  "/get-recipe-by-cuisine/:cuisine",
  verifyToken,
  errorCatch(getRecipeByCuisine)
);

export default router;
