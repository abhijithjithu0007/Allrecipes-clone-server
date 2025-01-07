import type { Request, Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import User from "../models/usersSchema";
import Otp from "../models/otpSchema";
import { generateOtp, getOtpEmailTemplate } from "../config/genarateOtp";
import { transporter } from "../config/nodeMailerConfig";
import jwt from "jsonwebtoken";

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) throw new CustomError("Email is required", 400);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const existingOtpEntry = await Otp.findOne({ email });

  if (existingOtpEntry) {
    existingOtpEntry.otp = generateOtp();
    existingOtpEntry.expiresAt = new Date(Date.now() + 300000);
    await existingOtpEntry.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: getOtpEmailTemplate(existingOtpEntry.otp),
    });

    res.status(200).json(new StandardResponse("OTP sent successfully"));
  } else {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 300000);

    const otpEntry = new Otp({
      email,
      otp,
      expiresAt,
    });
    await otpEntry.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: getOtpEmailTemplate(otp),
    });

    res.status(200).json(new StandardResponse("OTP sent successfully"));
  }
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
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY || "",
      {
        expiresIn: "1d",
      }
    );
    res.cookie(
      "user",
      JSON.stringify({ id: newUser._id, authMethod: "email", token: token }),
      {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        sameSite: "none",
      }
    );
    res.status(200).json(new StandardResponse("Email verified successfully"));
  }
};

export const sendOtpForLogin = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new CustomError("Email is required", 400);
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new CustomError("You havent registered", 404);
  }
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
    html: getOtpEmailTemplate(otp),
  });

  res.status(200).json(new StandardResponse("OTP sent successfully"));
};

export const verifyOtpForLogin = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new CustomError("Email and OTP are required", 400);
  }

  const otpEntry = await Otp.findOne({ email });

  if (!otpEntry) {
    throw new CustomError("User not found", 400);
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
  if (!user) {
    throw new CustomError("User not found", 404);
  } else {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY || "", {
      expiresIn: "1d",
    });
    res.cookie(
      "user",
      JSON.stringify({ id: user._id, authMethod: "email", token: token }),
      {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        sameSite: "none",
      }
    );
    res.status(200).json(new StandardResponse("Email verified successfully"));
  }
};
