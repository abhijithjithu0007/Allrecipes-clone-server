import express from "express";
import { errorCatch } from "../utils/errors/errorCatch";
import { validateData } from "../middlewares/zodValidation";
import { registerSchema, otpSchema } from "../utils/zodSchema";
import { register, sendOtp, verifyOtp } from "../controllers/authController";

const router = express.Router();

//Register user
router.post("/register", validateData(registerSchema), errorCatch(register));

//Send OTP
router.post("/sendOtp", errorCatch(sendOtp));

//Verify OTP
router.post("/verifyOtp", validateData(otpSchema), errorCatch(verifyOtp));

export default router;