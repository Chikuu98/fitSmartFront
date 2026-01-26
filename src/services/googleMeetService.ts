import axios from "axios";
import type { Booking } from "../interfaces/booking";
import { updateBookingMeetLinkSilent } from "../api/endpoints/bookings";
import { appConfig } from "../config/appConfig";
import { toast } from "react-toastify";

export const createGoogleMeeting = async (token: string, booking: Booking) => {
  if (!booking.mentorSlot) throw new Error("Booking is missing mentorSlot");

  let loadingToastId: any = null;

  try {
    loadingToastId = toast.loading("Creating Google Meet link...");

    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const event = {
      summary: "FitSmart Mentoring Session",
      description: "Scheduled meeting via FitSmart app",
      start: {
        dateTime: `${booking.mentorSlot.date}T${booking.mentorSlot.start_time}`,
        timeZone: browserTimeZone,
      },
      end: {
        dateTime: `${booking.mentorSlot.date}T${booking.mentorSlot.end_time}`,
        timeZone: browserTimeZone,
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${booking.id}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await axios.post(appConfig.googleCalendarApiUrl, event, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const meetLink = response.data?.conferenceData?.entryPoints?.find(
      (e: any) => e.entryPointType === "video",
    )?.uri;

    if (!meetLink)
      throw new Error("No Google Meet link found in event response");

    await updateBookingMeetLinkSilent(booking.id, meetLink);

    toast.update(loadingToastId, {
      render: "Google Meet link created and saved successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    return meetLink;
  } catch (err) {
    if (loadingToastId) {
      toast.update(loadingToastId, {
        render: "Failed to create Google Meet link",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
    console.error("Meeting creation failed", err);
    throw err;
  }
};
