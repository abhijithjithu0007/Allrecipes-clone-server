import mongoose, { Document, Schema } from "mongoose";

interface RecipeDocument extends Document {
  title: string;
  description: string;
  ingredients: string[];
  directions: string[];
  image?: string;
  prepTime: string;
  servings: string;
  mealType: string;
  cuisine: string;
  notes?: string;
  nutrition?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const recipeSchema: Schema<RecipeDocument> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    directions: [{ type: String, required: true }],
    image: { type: String },
    mealType: { type: String, required: true },
    cuisine: { type: String, required: true },
    prepTime: {
      value: { type: String, required: true },
      unit: { type: String, required: true },
    },
    servings: { type: String, required: true },
    notes: { type: String },
    nutrition: { type: String },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model<RecipeDocument>("Recipe", recipeSchema);
export default Recipe;
