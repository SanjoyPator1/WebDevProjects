// controllers/movieController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllMovies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //optional query movieName
    const { movieName } = req.query;

    let movies;

    if (movieName) {
      const searchTerm = (movieName as string).toLowerCase();
    
      movies = await prisma.movie.findMany({
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        }
      });
    } else {
      movies = await prisma.movie.findMany();
    }
    
    if (movies.length === 0) {
      res.json([]);
      return;
    }

    res.json(movies);

  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMovieById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "movieId is required field" });
      return;
    }

    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id) },
    });

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.json(movie);

  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, release_date } = req.body;

    if (!name || !release_date) {
      res.status(400).json({ error: "name and release_date are required fields" });
      return;
    }

    const newMovie = await prisma.movie.create({
      data: {
        name,
        release_date,
        average_rating: 0,
      },
    });

    res.status(201).json(newMovie);

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "movieId is required field" });
      return;
    }

    const { name, release_date } = req.body;

    if (!name || !release_date) {
      res.status(400).json({ error: "name and release_date are required fields" });
      return;
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: {
        name,
        release_date,
      },
    });

    res.json(updatedMovie);

  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMovie = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "movieId is required field" });
      return;
    }

    await prisma.review.deleteMany({
      where: {
        movieId: parseInt(id)
      }
    });

    await prisma.movie.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).end();
    
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
