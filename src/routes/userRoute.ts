import express from "express";

import { validateData } from "../middlewares/zodValidation";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/errors/errorCatch";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import { updateUserProfileSchema } from "../utils/zodSchema";

const router = express.Router();

router.get("/user-profile", verifyToken, errorCatch(getUserProfile));

router.put(
  "/update-profile",
  verifyToken,
  validateData(updateUserProfileSchema),
  errorCatch(updateUserProfile)
);

export default router;
