import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import authRoute from "./routes/authRoutes";
import recipeRoute from "./routes/recipeRoutes";
import reviewRoute from "./routes/reviewRoute";
import userRoute from "./routes/userRoute";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/recipe", recipeRoute);
app.use("/api/review", reviewRoute);
app.use("/api/user", userRoute);
app.use(globalErrorHandler);

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
