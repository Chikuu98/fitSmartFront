import axios from "axios";
import { axiosInstance } from "../axiosInstance";
import { appConfig } from "../../config/appConfig";

// Helper to ensure single slash between base and path
function withApiUrl(path: string) {
  return `${appConfig.apiUrl.replace(/\/?$/, "/")}${path.replace(/^\//, "")}`;
}

export const getBookingsByMentorId = async (mentor_id: number) => {
  const response = await axiosInstance.get(
    withApiUrl(`bookings/mentor/${mentor_id}`),
  );
  return response.data.data;
};

export const getBookingsByMemberId = async (member_id: number) => {
  const response = await axiosInstance.get(
    withApiUrl(`bookings/member/${member_id}`),
  );
  return response.data.data;
};

export const getBookingById = async (booking_id: number) => {
  const response = await axiosInstance.get(
    withApiUrl(`bookings/${booking_id}`),
  );
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
  booking_id: number,
  updateData: {
    status?: string;
    google_meet_link?: string;
    bookingPayment?: {
      status?: string;
    };
  },
) => {
  const response = await axiosInstance.patch(
    withApiUrl(`bookings/${booking_id}`),
    updateData,
  );
  return response.data;
};

export const acceptBooking = async (
  booking_id: number,
  googleMeetLink: string,
) => {
  const response = await axiosInstance.patch(
    withApiUrl(`bookings/${booking_id}/accept`),
    {
      google_meet_link: googleMeetLink,
    },
  );
  return response.data;
};

export const updateBookingMeetLink = async (
  booking_id: number,
  googleMeetLink: string,
) => {
  const response = await axiosInstance.patch(
    withApiUrl(`bookings/${booking_id}`),
    {
      google_meet_link: googleMeetLink,
    },
  );
  return response.data;
};

export const updateBookingMeetLinkSilent = async (
  booking_id: number,
  googleMeetLink: string,
) => {
  // Use regular axios instead of axiosInstance to avoid automatic toast
  const response = await axios.patch(
    withApiUrl(`bookings/${booking_id}`),
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

export const cancelBooking = async (booking_id: number) => {
  const response = await axiosInstance.patch(
    withApiUrl(`bookings/${booking_id}/cancel`),
  );
  return response.data;
};
