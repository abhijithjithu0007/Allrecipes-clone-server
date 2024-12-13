import express from "express";
import { errorCatch } from "../utils/errors/errorCatch";
import { validateData } from "../middlewares/zodValidation";
import { registerSchema } from "../utils/zodSchema";
import { register } from "../controllers/authController";

const router = express.Router();

//Register user
router.post("/register", validateData(registerSchema), errorCatch(register));

export default router;
