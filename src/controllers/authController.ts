import type { Request, Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import User from "../models/usersSchema";
import Otp from "../models/otpSchema";
import { generateOtp } from "../config/genarateOtp";
import { transporter } from "../config/nodeMailerConfig";

export const register = async (req: Request, res: Response) => {
  const { name = "", email, profileImage = "" } = req.body;

  if (!email) {
    throw new CustomError("All fields are required", 400);
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }
  const newUser = new User({ name, email, profileImage });
  await newUser.save();

  res.status(200).json(new StandardResponse("User registered successfully"));
};

////////////////////////////////////////////

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) throw new CustomError("Email is required", 400);

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 300000);

  const existingOtpEntry = await Otp.findOne({ email });

  if (existingOtpEntry) {
    existingOtpEntry.otp = otp;
    existingOtpEntry.expiresAt = expiresAt;
    await existingOtpEntry.save();
  } else {
    const otpEntry = new Otp({
      email,
      otp,
      expiresAt,
    });
    await otpEntry.save();
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  res.status(200).json(new StandardResponse("OTP sent successfully"));
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new CustomError("Email and OTP are required", 400);
  }

  const otpEntry = await Otp.findOne({ email });

  if (!otpEntry) {
    throw new CustomError("Invalid OTP", 400);
  }

  if (otpEntry.otp !== otp) {
    throw new CustomError("Invalid OTP", 400);
  }

  const currentTime = new Date().getTime();
  const otpUpdatedTime = new Date(otpEntry.expiresAt).getTime();
  const timeDifference = (currentTime - otpUpdatedTime) / 1000 / 60;

  if (timeDifference > 5) {
    throw new CustomError("OTP expired", 400);
  }

  const user = await User.findOne({ email });
  if (user) {
    res.status(200).json(new StandardResponse("User already exists"));
  } else {
    const newUser = new User({ email });
    await newUser.save();
    res.status(200).json(new StandardResponse("Email verified successfully"));
  }
};
