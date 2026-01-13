import { axiosInstance } from "../axiosInstance";
import type {
  CreateRatingDto,
  UpdateRatingDto,
  Rating,
  RatingResponse,
  MentorRatingStats,
} from "../../interfaces/rating";

export const createRating = async (
  ratingData: CreateRatingDto
): Promise<{ success: boolean; message: string; data: Rating }> => {
  const response = await axiosInstance.post("/ratings", ratingData);
  return response.data;
};

export const updateRating = async (
  ratingId: number,
  ratingData: UpdateRatingDto
): Promise<{ success: boolean; message: string; data: Rating }> => {
  const response = await axiosInstance.patch(`/ratings/${ratingId}`, ratingData);
  return response.data;
};

export const deleteRating = async (ratingId: number): Promise<void> => {
  await axiosInstance.delete(`/ratings/${ratingId}`);
};

export const getRatingsByMentor = async (
  mentorId: number,
  page = 1,
  limit = 10
): Promise<RatingResponse> => {
  const response = await axiosInstance.get(`/ratings/mentor/${mentorId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const getMyRatings = async (
  page = 1,
  limit = 10
): Promise<RatingResponse> => {
  const response = await axiosInstance.get("/ratings/member/my-ratings", {
    params: { page, limit },
  });
  return response.data;
};

export const getRatingByBooking = async (
  bookingId: number
): Promise<Rating | null> => {
  const response = await axiosInstance.get(`/ratings/booking/${bookingId}`);
  return response.data;
};

export const getMentorAverageRating = async (
  mentorId: number
): Promise<MentorRatingStats> => {
  const response = await axiosInstance.get(`/ratings/mentor/${mentorId}/average`);
  return response.data;
};
