import { useMutation, useQuery } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { queryClient } from "../../App";
import { MOVIES_KEY, MOVIE_KEY, REVIEWS_KEY } from "../../libs/constant";
import { Movie, NewReview, Review } from "../../models/interfaces";
import axiosInstance from "../../services/axios";

interface AddReviewModalProps {
  onClose: () => void;
  mode: "add" | "update";
  review?: Review;
}

const AddReviewModal: FC<AddReviewModalProps> = ({
  onClose,
  mode,
  review,
}) => {
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState<number | undefined>(0);
  const [reviewComments, setReviewComments] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<number | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null); // New state for comment error

  const { id } = useParams();

  useEffect(() => {
    if (mode === "update" && review) {
      setReviewerName(review.reviewer_name);
      setRating(review.rating);
      setReviewComments(review.review_comments);
      setSelectedMovie(review.movieId);
    }

    if(id){
      setSelectedMovie(Number(id)); 
    }

  }, [mode, review]);

  const { isLoading, data: movies } = useQuery<Movie[], Error>({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axiosInstance.get("/movies");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newReview: NewReview) => {
      // Use POST for adding a new review and PUT for updating an existing review
      if (mode === "add") {
        return axiosInstance.post("/reviews", newReview);
      } else {
        return axiosInstance.put(`/reviews/${review?.id}`, newReview);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [REVIEWS_KEY, selectedMovie],
      });
      await queryClient.invalidateQueries({
        queryKey: [MOVIE_KEY, selectedMovie],
      });
      await queryClient.invalidateQueries({ queryKey: [MOVIES_KEY] });
      // Display different toast messages for add and update modes
      const message =
        mode === "add"
          ? "Review added successfully"
          : "Review updated successfully";
      toast.success(message);
    },
    onError: (error: any) => {
      toast.error(
        `Error ${mode === "add" ? "adding" : "updating"} review: ${
          error.message
        }`
      );
    },
  });

  const handleSave = async () => {
    try {
      let isValid = true;

      if (!selectedMovie) {
        setError("Please select a movie.");
        isValid = false;
        return;
      }
      if (rating === undefined || rating < 0 || rating > 10) {
        setRatingError("Rating must be between 0 and 10.");
        isValid = false;
      }
      if (!reviewComments.trim()) {
        // Validate review comments
        setCommentError("Review comments are required.");
        isValid = false;
      }

      if (!isValid) {
        toast.error("Form invalid");
        return;
      }

      const newReview: NewReview = {
        movieId: selectedMovie,
        rating: rating || 0,
        review_comments: reviewComments,
      };

      if (reviewerName && reviewerName.trim() !== "") {
        newReview.reviewer_name = reviewerName.trim();
      }

      mutation.mutate(newReview);
      onClose();
    } catch (error) {
      console.error("Error creating review:", error);
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
            <h2 className="text-xl mb-4">Add Review</h2>
            <div className="mb-4">
              <label htmlFor="movie" className="font-medium text-gray-800">
                Movie:
              </label>
              <select
                id="movie"
                value={selectedMovie}
                onChange={(e) => {
                  setSelectedMovie(Number(e.target.value));
                  setError(null);
                }}
                className="w-full outline-none rounded bg-gray-100 p-2 mt-2 mb-3"
              >
                <option value="">Select Movie</option>
                {isLoading ? (
                  <option value="" disabled>
                    Loading...
                  </option>
                ) : movies ? (
                  movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Error loading movies
                  </option>
                )}
              </select>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <label htmlFor="reviewerName" className="font-medium text-gray-800">
              Reviewer Name:
            </label>
            <input
              type="text"
              id="reviewerName"
              value={reviewerName}
              onChange={(e) => {
                setReviewerName(e.target.value);
                setError(null);
              }}
              className="w-full outline-none rounded bg-gray-100 p-2 mt-2 mb-3"
            />
            <label htmlFor="rating" className="font-medium text-gray-800">
              Rating:
            </label>
            <input
              type="number"
              id="rating"
              value={rating}
              min="0"
              max="10"
              onChange={(e) => {
                setRating(Number(e.target.value));
                setRatingError(null);
              }}
              className="w-full outline-none rounded bg-gray-100 p-2 mt-2 mb-3"
            />
            {ratingError && (
              <p className="text-red-500 text-sm">{ratingError}</p>
            )}
            <label
              htmlFor="reviewComments"
              className="font-medium text-gray-800"
            >
              Review Comments:
            </label>
            <textarea
              id="reviewComments"
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              className="w-full outline-none rounded bg-gray-100 p-2 mt-2 mb-3"
            />
            {commentError && (
              <p className="text-red-500 text-sm">{commentError}</p>
            )}{" "}
            {/* Display comment error */}
          </div>
          <div className=" px-4 py-3 text-right">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2 px-4 bg-blue-500 text-white rounded font-medium hover:bg-blue-700 mr-2 transition duration-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
