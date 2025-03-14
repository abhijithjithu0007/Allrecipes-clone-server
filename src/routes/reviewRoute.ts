import express from "express";

import { validateData } from "../middlewares/zodValidation";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/errors/errorCatch";
import { addReviewSchema } from "../utils/zodSchema";
import {
  addReview,
  filterReviewByRating,
  getReviewByRecipe,
  updateReviewHelpful,
} from "../controllers/reviewController";

const router = express.Router();

router.post(
  "/add-review",
  verifyToken,
  validateData(addReviewSchema),
  errorCatch(addReview)
);

router.get(
  "/get-review-by-recipe/:recipeId",
  verifyToken,
  errorCatch(getReviewByRecipe)
);

router.get(
  "/filter-review-by-rating",
  verifyToken,
  errorCatch(filterReviewByRating)
);

router.post("/update-helpful", verifyToken, errorCatch(updateReviewHelpful));

export default router;
