// api/reviewApi.ts

import { useQuery } from "@tanstack/react-query";
import { Review } from "../../models/interfaces";
import axiosInstance from "../axios";
import { REVIEWS_KEY } from "../../libs/constant";

export const useGetAllReviews = (movieId?: number) => {
  return useQuery<Review[], Error>({
    queryKey: [REVIEWS_KEY, movieId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/reviews`,{
        params:{
          movieId: movieId
        }
      });
      return response.data;
    },
  });
};

export const createReview = async (
  reviewData: Partial<Review>
): Promise<Review> => {
  try {
    const response = await axiosInstance.post("/reviews", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw new Error("Failed to create review");
  }
};

export const deleteReview = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/reviews/${id}`);
  } catch (error) {
    console.error(`Error deleting review with id ${id}:`, error);
    throw new Error(`Failed to delete review with id ${id}`);
  }
};
