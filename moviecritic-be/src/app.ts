import express from "express";
import cors from "cors";
import { indexRouter } from "./routes";
import { movieRouter } from "./routes/movieRoutes";
import { reviewRouter } from "./routes/reviewRoutes";

export const app = express();

// Allow requests from all origins
app.use(cors());

// Add middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/", indexRouter);
app.use("/movies", movieRouter);
app.use("/reviews", reviewRouter);
