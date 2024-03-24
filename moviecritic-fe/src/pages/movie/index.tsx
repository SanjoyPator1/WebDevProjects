import { Link, useParams } from "react-router-dom";
import ReviewCard from "../../components/reviewCard";
import { useGetMovieById } from "../../services/api/movieApi";
import { useGetAllReviews } from "../../services/api/reviewApi";

const Movie = () => {
  const { id } = useParams();

  const {
    isLoading: isLoadingMovieDetail,
    error: errorMovieDetail,
    data: movie,
  } = useGetMovieById(Number(id));

  const {
    isLoading: isLoadingReviews,
    error: errorReviews,
    data: reviews,
  } = useGetAllReviews(Number(id)); // Fetch all reviews related to the movie

  if (isLoadingMovieDetail || isLoadingReviews) {
    return <p>Loading...</p>;
  }

  if (errorMovieDetail || errorReviews) {
    return (
      <p className="text-red-600">
        Error: {errorMovieDetail?.message || errorReviews?.message}
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center gap-1 w-full">
        <Link to="/" className="text-2xl font-bold mr-3 border rounded-md w-8 h-8 flex items-center justify-center">
          &lt;
        </Link>
        <h2 className="flex-1 text-3xl font-semibold">{movie?.name}</h2>
        <h2 className="text-blue-600 text-3xl font-semibold">
          {movie?.average_rating ? parseFloat(movie?.average_rating.toFixed(2)) : 0}/10
        </h2>
      </div>

      {/* Show reviews */}
      <div className="mt-4 w-full h-[70vh] overflow-y-auto flex flex-col">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>
        {reviews && reviews.length > 0 ? (
          <div className="w-full flex flex-col gap-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            {errorReviews ? "Error fetching reviews" : "No reviews found"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Movie;
