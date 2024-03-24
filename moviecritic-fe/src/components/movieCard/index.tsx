import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { queryClient } from "../../App";
import { Movie } from "../../models/interfaces";
import axiosInstance from "../../services/axios";
import AddMovieModal from "../addMovieModal";
import ConfirmationModal from "../confirmationModal";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: FC<MovieCardProps> = ({ movie }) => {
  const { id, name, release_date, average_rating } = movie;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false); // State for showing the Add/Edit modal

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate.replace(/(\d+)(th|nd|rd|st)/, "$1$2");
  };

  const mutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/movies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      toast.success("Movie deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Error deleting movie: ${error.message}`);
    },
  });

  const handleDelete = () => {
    mutation.mutate();
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Link to={`/movie/${id}`} className="h-full">
        <div className="h-full bg-blue-100 rounded-md p-4">
          <h2 className="text-xl font-bold mb-2">{name}</h2>
          <p className="text-gray-600 mb-2 font-italic">
            Release Date: {formatDate(release_date)}
          </p>
          <div className="flex items-center">
            <div className="flex-grow flex">
              <span className="font-semibold mr-1">Rating:</span>
              <div className="flex items-center">
                <span className="font-semibold">
                  {average_rating ? average_rating : 0}
                </span>
                <span className="font-semibold">/10</span>
              </div>
            </div>
            {/* Button to trigger delete confirmation modal */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteConfirmation(true);
              }}
              className="text-red-600 mr-2"
            >
              <IconTrash />
            </button>
            {/* Button to trigger add/edit modal */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowAddEditModal(true)
              }}
              className="text-blue-600"
            >
              <IconEdit />
            </button>
          </div>
        </div>
      </Link>

      {/* Delete confirmation modal */}
      <ConfirmationModal
       primaryText="Delete Movie"
       secondaryText="Are you sure you want to delete this Movie?"
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
      />

      {/* Add/Edit movie modal */}
      {showAddEditModal && <AddMovieModal
        onClose={() => setShowAddEditModal(false)}
        mode="update"
        movie={movie}
      />}
    </div>
  );
};

export default MovieCard;
