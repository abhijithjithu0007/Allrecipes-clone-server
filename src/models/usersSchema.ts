import mongoose, { Document, Schema } from "mongoose";

interface UserType extends Document {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const usersSchema: Schema<UserType> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserType>("User", usersSchema);
export default User;
