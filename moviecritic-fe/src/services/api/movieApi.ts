import axiosInstance from "../axios";

import {
  useQuery
} from "@tanstack/react-query";
import { Movie } from "../../models/interfaces";
import { MOVIES_KEY, MOVIE_KEY } from "../../libs/constant";

// Define the query hook for fetching all movies
export const useGetAllMovies = (movieName?: string) => {
  return useQuery<Movie[], Error>({
    queryKey: [MOVIES_KEY],
    queryFn: async () => {
      const url = movieName ? `/movies?movieName=${encodeURIComponent(movieName)}` : "/movies";
      const response = await axiosInstance.get(url);
      return response.data;
    },
  });
};

// Define the query hook for fetching a single movie by id
export const useGetMovieById = (id: number) => {
  return useQuery<Movie, Error>({
    queryKey: [MOVIE_KEY, id], // Unique key for this query
    queryFn: async () => {
      const response = await axiosInstance.get(`/movies/${id}`);
      return response.data;
    },
  });
};

