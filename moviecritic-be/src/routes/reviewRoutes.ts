// routes/reviewRoutes.ts
import { Router } from "express";
import { getAllReviews, createReview, deleteReview, updateReview } from "../controllers/reviewController";

export const reviewRouter = Router();

reviewRouter.get("/", getAllReviews);
reviewRouter.post("/", createReview);
reviewRouter.put("/:id", updateReview); 
reviewRouter.delete("/:id", deleteReview);
