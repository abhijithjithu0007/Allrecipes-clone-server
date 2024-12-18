import express from "express";

import { validateData } from "../middlewares/zodValidation";
import { addRecipeSchema } from "../utils/zodSchema";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/errors/errorCatch";
import { addRecipe } from "../controllers/recipeController";

const router = express.Router();

router.post(
  "/add-recipe",
  verifyToken,
  validateData(addRecipeSchema),
  errorCatch(addRecipe)
);

export default router;
