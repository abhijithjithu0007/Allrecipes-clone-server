import type { Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/errors/customError";
import { CustomRequest } from "../types/interface";
import Recipe from "../models/recipeSchema";
import Review from "../models/reviewSchema";
import mongoose from "mongoose";

export const addReview = async (req: CustomRequest, res: Response) => {
  const { recipeId, rating, notes = "" } = req.body;

  if (!recipeId || !rating) {
    throw new CustomError("All fields are required", 400);
  }

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    throw new CustomError("Recipe not found", 404);
  }

  const review = new Review({
    recipe: recipeId,
    user: req.user?.id,
    rating,
    notes,
  });

  await review.save();

  res
    .status(200)
    .json(new StandardResponse("Review added successfully", review));
};

export const getReviewByRecipe = async (req: CustomRequest, res: Response) => {
  const { recipeId } = req.params;
  const reviews = await Review.aggregate([
    { $match: { recipe: new mongoose.Types.ObjectId(recipeId) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ]);

  res
    .status(200)
    .json(new StandardResponse("Reviews fetched successfully", reviews));
};

export const filterReviewByRating = async (
  req: CustomRequest,
  res: Response
) => {
  const { recipeId } = req.query;
  let ratings = req.query.ratings;

  if (!recipeId || !ratings) {
    throw new CustomError("All fields are required", 400);
  }

  if (typeof ratings === "string") {
    ratings = [ratings];
  } else if (!Array.isArray(ratings)) {
    throw new CustomError("Ratings must be an array or a string", 400);
  }

  const numericRatings = ratings.map((rating) => Number(rating));

  const reviews = await Review.aggregate([
    { $match: { recipe: new mongoose.Types.ObjectId(recipeId as string) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $match: { rating: { $in: numericRatings } } },
  ]);

  res
    .status(200)
    .json(new StandardResponse("Reviews fetched successfully", reviews));
};

export const updateReviewHelpful = async (
  req: CustomRequest,
  res: Response
) => {
  const { reviewId, userId } = req.body;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError("Review not found", 404);
  }

  const userHasHelpfuled = review.helpfulBy.includes(userId);
  if (userHasHelpfuled) {
    review.helpfulBy = review.helpfulBy.filter((id) => id !== userId);
    review.helpful -= 1;
  } else {
    review.helpfulBy.push(userId);
    review.helpful += 1;
  }

  res.status(200).json(
    new StandardResponse("Review help updated successfully", {
      helpful: review.helpful,
      userHasHelpfuled: !userHasHelpfuled,
    })
  );

  await review.save();
};
