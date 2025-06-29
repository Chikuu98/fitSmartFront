import axios from "axios";
import { axiosInstance } from "../axiosInstance";
import { appConfig } from "../../config/appConfig";

// Helper to ensure single slash between base and path
function withApiUrl(path: string) {
  return `${appConfig.apiUrl.replace(/\/?$/, "/")}${path.replace(/^\//, "")}`;
}

export const getBookingsByMentorId = async (mentorId: number) => {
  const response = await axiosInstance.get(
    withApiUrl(`bookings/mentor/${mentorId}`),
  );
  return response.data.data;
};

export const getBookingsByMemberId = async (memberId: number) => {
  const response = await axiosInstance.get(
    withApiUrl(`bookings/member/${memberId}`),
  );
  return response.data.data;
};

export const getBookingById = async (bookingId: number) => {
  const response = await axiosInstance.get(withApiUrl(`bookings/${bookingId}`));
  return response.data.data;
};

export const createBooking = async (bookingData: {
  mentor_slot_id: number;
}) => {
  const response = await axiosInstance.post(
    withApiUrl("bookings"),
    bookingData,
  );
  return response.data;
};

export const updateBooking = async (
  bookingId: number,
  updateData: {
    status?: string;
    payment_status?: string;
    google_meet_link?: string;
  },
) => {
  const response = await axiosInstance.patch(
    withApiUrl(`bookings/${bookingId}`),
    updateData,
  );
  return response.data;
};

export const acceptBooking = async (
  bookingId: number,
  googleMeetLink: string,
) => {
  const response = await axiosInstance.patch(
    withApiUrl(`bookings/${bookingId}/accept`),
    {
      google_meet_link: googleMeetLink,
    },
  );
  return response.data;
};

export const updateBookingMeetLink = async (
  bookingId: number,
  googleMeetLink: string,
) => {
  const response = await axiosInstance.patch(
    withApiUrl(`bookings/${bookingId}`),
    {
      google_meet_link: googleMeetLink,
    },
  );
  return response.data;
};

export const updateBookingMeetLinkSilent = async (
  bookingId: number,
  googleMeetLink: string,
) => {
  // Use regular axios instead of axiosInstance to avoid automatic toast
  const response = await axios.patch(
    withApiUrl(`bookings/${bookingId}`),
    {
      google_meet_link: googleMeetLink,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      withCredentials: true,
    },
  );
  return response.data;
};

export const cancelBooking = async (bookingId: number) => {
  const response = await axiosInstance.patch(
    withApiUrl(`bookings/${bookingId}/cancel`),
  );
  return response.data;
};
