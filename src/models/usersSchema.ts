import mongoose, { Document, Schema } from "mongoose";

interface UserType extends Document {
  name?: string;
  email: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const usersSchema: Schema<UserType> = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", usersSchema);
export default User;
