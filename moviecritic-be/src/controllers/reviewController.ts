// controllers/reviewController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface NewReview {
  movieId: number;
  rating: number;
  review_comments: string;
  reviewer_name?: string;
}

export const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId } = req.query;

    let reviews;
    if (movieId) {
      reviews = await prisma.review.findMany({
        where: { movieId: parseInt(movieId.toString()) },
      });
    } else {
      reviews = await prisma.review.findMany();
    }
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId, rating, review_comments } = req.body; 

    if (!movieId || !review_comments) {
      res.status(400).json({ error: "movieId and review_comments are required fields" });
      return;
    }    

    if (rating < 0 || rating > 10) {
      res.status(400).json({ error: "Rating must be between 0 and 10" });
      return;
    }

    const newReviewData:NewReview = {
      movieId: parseInt(movieId),
      rating,
      review_comments,
    };

    if (req.body.reviewer_name) {
      newReviewData.reviewer_name = req.body.reviewer_name;
    }

    const newReview = await prisma.review.create({
      data: newReviewData,
    });

    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId) },
      include: { reviews: true },
    });

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const totalReviews = movie.reviews.length;
    const totalRatings = movie.reviews.reduce((acc, cur) => acc + cur.rating, 0);
    const averageRating = totalReviews ? parseFloat((totalRatings / totalReviews).toFixed(2)) : 0;

    await prisma.movie.update({
      where: { id: parseInt(movieId) },
      data: { average_rating: averageRating },
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { movieId, rating, review_comments, reviewer_name } = req.body;

    if (rating < 0 || rating > 10) {
      res.status(400).json({ error: "Rating must be between 0 and 10" });
      return;
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        movieId: parseInt(movieId),
        rating,
        review_comments,
        reviewer_name,
      },
    });

    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId) },
      include: { reviews: true },
    });

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const totalReviews = movie.reviews.length;
    const totalRatings = movie.reviews.reduce((acc, cur) => acc + cur.rating, 0);
    const averageRating = totalReviews ? parseFloat((totalRatings / totalReviews).toFixed(2)) : 0;

    await prisma.movie.update({
      where: { id: parseInt(movieId) },
      data: { average_rating: averageRating },
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      select: { movieId: true }
    });

    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    await prisma.review.delete({
      where: { id: parseInt(id) },
    });

    // updating the average rating of the movie
    const movie = await prisma.movie.findUnique({
      where: { id: review.movieId },
      include: { reviews: true },
    });

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    const totalReviews = movie.reviews.length;
    const totalRatings = movie.reviews.reduce((acc, cur) => acc + cur.rating, 0);
    const averageRating = totalReviews ? parseFloat((totalRatings / totalReviews).toFixed(2)) : 0;

    await prisma.movie.update({
      where: { id: review.movieId },
      data: { average_rating: averageRating },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

