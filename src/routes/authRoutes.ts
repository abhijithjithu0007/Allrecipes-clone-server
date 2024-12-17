import express from "express";
import { errorCatch } from "../utils/errors/errorCatch";
import { validateData } from "../middlewares/zodValidation";
import { registerSchema, otpSchema, loginSchema } from "../utils/zodSchema";
import {
  sendOtp,
  sendOtpForLogin,
  verifyOtp,
  verifyOtpForLogin,
} from "../controllers/emailAuthController";
import {
  googleLogin,
  googleRegister,
} from "../controllers/googleAuthController";

const router = express.Router();

//Send OTP
router.post("/sendOtp", errorCatch(sendOtp));
//send otp for login
router.post("/send-login-otp", errorCatch(sendOtpForLogin));

//Verify OTP
router.post("/verifyOtp", validateData(otpSchema), errorCatch(verifyOtp));
//verify otp for login
router.post(
  "/verify-login-otp",
  validateData(otpSchema),
  errorCatch(verifyOtpForLogin)
);

//Register user
router.post(
  "/register",
  validateData(registerSchema),
  errorCatch(googleRegister)
);

//google-login
router.post("/g-login", validateData(loginSchema), errorCatch(googleLogin));

export default router;
