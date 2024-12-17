import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import authRoute from "./routes/authRoutes";

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World!");
});
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use("/api/auth", authRoute);
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
