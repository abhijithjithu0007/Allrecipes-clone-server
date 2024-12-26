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
const addRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  mealType: z.string(),
  cuisine: z.string(),
  ingredients: z.array(z.string()),
  directions: z.array(z.string()),
  image: z.string().optional(),
  prepTime: z.object({
    value: z.string(),
    unit: z.string(),
  }),
  servings: z.string(),
  notes: z.string().optional(),
});

const addReviewSchema = z.object({
  recipeId: z.string(),
  notes: z.string().optional(),
  rating: z.number(),
});

export {
  loginSchema,
  registerSchema,
  otpSchema,
  addRecipeSchema,
  addReviewSchema,
};
