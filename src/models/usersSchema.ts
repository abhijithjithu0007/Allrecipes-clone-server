import mongoose, { Document, Schema } from "mongoose";

interface UserType extends Document {
  name?: string;
  email: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  savedRecipes: string[];
}

const usersSchema: Schema<UserType> = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
    savedRecipes: {
      type: [String],
      default: [],
      ref: "Recipe",
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", usersSchema);
export default User;
