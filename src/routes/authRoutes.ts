import express from "express";
import { errorCatch } from "../utils/errors/errorCatch";
import { validateData } from "../middlewares/zodValidation";
import { registerSchema, otpSchema, loginSchema } from "../utils/zodSchema";
import { sendOtp, verifyOtp } from "../controllers/emailAuthController";
import {
  googleLogin,
  googleRegister,
} from "../controllers/googleAuthController";

const router = express.Router();

//Register user
router.post(
  "/register",
  validateData(registerSchema),
  errorCatch(googleRegister)
);

//Send OTP
router.post("/sendOtp", errorCatch(sendOtp));

//Verify OTP
router.post("/verifyOtp", validateData(otpSchema), errorCatch(verifyOtp));

//login
router.post("/login", validateData(loginSchema), errorCatch(googleLogin));

export default router;
