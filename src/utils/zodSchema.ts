import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  profileImage: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string(),
  namr: z.string().optional(),
});

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});

export { loginSchema, registerSchema, otpSchema };
