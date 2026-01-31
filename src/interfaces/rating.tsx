export interface Rating {
  id: number;
  booking: {
    id: number;
    status: string;
  };
  member: {
    id: number;
    name: string;
  };
  mentor: {
    id: number;
    name: string;
  };
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRatingDto {
  bookingId: number;
  rating: number;
  review?: string;
}

export interface UpdateRatingDto {
  rating?: number;
  review?: string;
}

export interface RatingResponse {
  data: Rating[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MentorRatingStats {
  averageRating: number;
  totalRatings: number;
}
