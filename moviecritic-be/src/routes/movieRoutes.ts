// routes/movieRoutes.ts
import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController";

export const movieRouter = Router();

movieRouter.get("/", getAllMovies);
movieRouter.get("/:id", getMovieById);
movieRouter.post("/", createMovie);
movieRouter.put("/:id", updateMovie);
movieRouter.delete("/:id", deleteMovie);
