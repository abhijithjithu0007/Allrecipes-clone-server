import mongoose, { Document, Schema } from "mongoose";

interface ReviewType extends Document {
  recipe: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  notes?: string;
  rating: number;
  createdAt: Date;
}

const reviewSchema: Schema<ReviewType> = new Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model<ReviewType>("Review", reviewSchema);
export default Review;
