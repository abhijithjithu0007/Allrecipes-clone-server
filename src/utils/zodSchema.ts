import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  profileImage: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export { loginSchema, registerSchema };
