import express from "express";

import { validateData } from "../middlewares/zodValidation";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/errors/errorCatch";
import { addReviewSchema } from "../utils/zodSchema";
import { addReview } from "../controllers/reviewController";

const router = express.Router();

router.post(
  "/add-review",
  verifyToken,
  validateData(addReviewSchema),
  errorCatch(addReview)
);

export default router;
