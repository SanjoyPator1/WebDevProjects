import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axios";
import { queryClient } from "../../App";
import { toast } from "sonner";
import { Movie } from "../../models/interfaces";
import { MOVIES_KEY, MOVIE_KEY } from "../../libs/constant";

interface AddMovieModalProps {
  onClose: () => void;
  mode: "add" | "update";
  movie?: Movie;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
  onClose,
  mode,
  movie,
}) => {
  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [nameError, setNameError] = useState("");
  const [releaseDateError, setReleaseDateError] = useState("");

  // Initialize input fields with movie data in update mode
  useEffect(() => {
    if (mode === "update" && movie) {
      setName(movie.name);
      const formattedDate = new Date(movie.release_date)
        .toISOString()
        .split("T")[0];
      setReleaseDate(formattedDate);
    }
  }, [mode, movie]);

  const mutation = useMutation({
    mutationFn: (newMovie: { name: string; release_date: string }) => {
      // Use POST for adding a new movie and PUT for updating an existing movie
      if (mode === "add") {
        return axiosInstance.post("/movies", newMovie);
      } else {
        return axiosInstance.put(`/movies/${movie?.id}`, newMovie);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MOVIES_KEY] });
      if (mode === "update") {
        queryClient.invalidateQueries({ queryKey: [MOVIE_KEY, movie?.id] });
      }
      // Display different toast messages for add and update modes
      const message =
        mode === "add"
          ? "Movie added successfully"
          : "Movie updated successfully";
      toast.success(message);
    },
    onError: (error: any) => {
      toast.error(
        `Error ${mode === "add" ? "adding" : "updating"} movie: ${
          error.message
        }`
      );
    },
  });

  const handleSave = async () => {
    try {
      let isValid = true;

      // Check if name is empty
      if (!name) {
        setNameError("Please enter a movie name");
        isValid = false;
      } else {
        setNameError("");
      }

      // Check if release date is empty
      if (!releaseDate) {
        setReleaseDateError("Please select a release date");
        isValid = false;
      } else {
        setReleaseDateError("");
      }

      if (!isValid) {
        toast.error("Form invalid");
        return;
      }

      // Convert releaseDate to ISO-8601 DateTime format
      const isoReleaseDate = new Date(releaseDate).toISOString();
      const newMovie = {
        name,
        release_date: isoReleaseDate,
      };

      mutation.mutate(newMovie);

      console.log("New movie created:", newMovie);
      onClose();
    } catch (error) {
      console.error(
        `Error ${mode === "add" ? "adding" : "updating"} movie:`,
        error
      );
      toast.error(
        `Error ${mode === "add" ? "adding" : "updating"} movie: ${error}`
      );
    }
  };

  return (
    <div className="fixed z-10 overflow-y-auto top-0 w-full left-0">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-900 opacity-75" />
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <span
              className="absolute top-0 right-0 p-4 cursor-pointer"
              onClick={onClose}
            >
              &times;
            </span>
            <h2 className="text-xl mb-4">
              {mode === "add" ? "Add Movie" : "Update Movie"}
            </h2>
            <label htmlFor="name" className="font-medium text-gray-800">
              Movie Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full outline-none rounded bg-gray-100 p-2 mt-2 mb-3"
            />
            {nameError && <p className="text-red-500 mb-2">{nameError}</p>}
            <label htmlFor="releaseDate" className="font-medium text-gray-800">
              Release Date:
            </label>
            <input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full outline-none rounded bg-gray-100 p-2 mt-2 mb-3"
            />
            {releaseDateError && (
              <p className="text-red-500 mb-2">{releaseDateError}</p>
            )}
          </div>
          <div className=" px-4 py-3 text-right">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
            >
              <i className="fas fa-times"></i> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-blue-500 text-white rounded font-medium hover:bg-blue-700 mr-2 transition duration-500"
              disabled={mutation.isPending}
            >
              <i className="fas fa-plus"></i> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMovieModal;
