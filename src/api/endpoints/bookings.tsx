import { axiosInstance } from "../axiosInstance";

export const getBookingsByMentorId = async (mentorId: number) => {
  const response = await axiosInstance.get(`/bookings/mentor/${mentorId}`);
  return response.data;
};
