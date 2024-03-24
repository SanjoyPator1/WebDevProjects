// types.ts
export interface Movie {
  id: number;
  name: string;
  release_date: string;
  average_rating: number | null;
}

export interface Review {
  id: number;
  movieId: number;
  reviewer_name: string;
  rating: number;
  review_comments: string;
}

export interface NewReview {
  movieId: number;
  rating: number;
  review_comments: string;
  reviewer_name?: string;
}
