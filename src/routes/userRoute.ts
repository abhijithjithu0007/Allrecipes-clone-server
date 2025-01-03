import express from "express";

import { validateData } from "../middlewares/zodValidation";
import { verifyToken } from "../middlewares/verifyToken";
import { errorCatch } from "../utils/errors/errorCatch";
import { getUserProfile } from "../controllers/userController";

const router = express.Router();

router.get("/user-profile", verifyToken, errorCatch(getUserProfile));

export default router;
