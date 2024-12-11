import mongoose, { Document, Schema } from "mongoose";
import { string } from "yup";

interface RecipeDocument extends Document {
  title: string;
  ingredients: string[];
  directions: string;
  image?: string;
  prepTime: number;
  servings: number;
  notes?: string;
  nutrition?: string;
  reviews: mongoose.Schema.Types.ObjectId[];
  createdBy: mongoose.Schema.Types.ObjectId;
}

const recipeSchema: Schema<RecipeDocument> = new Schema(
  {
    title: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    directions: { type: String, required: true },
    image: { type: String },
    prepTime: { type: Number, required: true },
    servings: { type: Number, required: true },
    notes: { type: String },
    nutrition: { type: string },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
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
