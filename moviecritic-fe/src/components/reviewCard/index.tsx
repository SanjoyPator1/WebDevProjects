import React, { useState } from "react";
import { toast } from "sonner";
import { Review } from "../../models/interfaces";
import ConfirmationModal from "../confirmationModal";
import AddReviewModal from "../addReviewModal";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { queryClient } from "../../App";
import { MOVIES_KEY, MOVIE_KEY, REVIEWS_KEY } from "../../libs/constant";
import { useParams } from "react-router-dom";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { id: movieId } = useParams();
  const { id, rating, review_comments, reviewer_name } = review;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/reviews/${id}`);
    },
    onSuccess: async () => {
      console.log("delete cache ",Number(movieId))
      await queryClient.invalidateQueries({
        queryKey: [REVIEWS_KEY, Number(movieId)],
      });
      await queryClient.invalidateQueries({
        queryKey: [MOVIE_KEY, Number(movieId)],
      });
      await queryClient.invalidateQueries({ queryKey: [MOVIES_KEY] });
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
    <>
      <div className="bg-white rounded-md border p-4 w-full flex flex-col gap-2">
        <div className="flex gap-1 justify-between">
          <p>{review_comments}</p>
          <p className="text-blue-600">{rating}/10</p>
        </div>
        <div className="w-full">
          <p className="italic">
            By {reviewer_name ? reviewer_name : "Anonymous"}
          </p>
        </div>
        <div className="flex justify-end">
          {/* Button to trigger delete confirmation modal */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowDeleteConfirmation(true);
            }}
            disabled={mutation.isPending}
            className="text-red-600 mr-2"
          >
            <IconTrash />
          </button>
          {/* Button to trigger edit modal */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowEditModal(true);
            }}
            className="text-blue-600"
          >
            <IconEdit />
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        primaryText="Delete review"
        secondaryText="Are you sure you want to delete this review?"
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
      />

      {/* Edit review modal */}
      {showEditModal && (
        <AddReviewModal
          mode="update"
          review={review}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default ReviewCard;
