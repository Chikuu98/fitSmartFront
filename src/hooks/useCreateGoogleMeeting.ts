import { useGoogleLogin } from "@react-oauth/google";
import { createGoogleMeeting } from "../services/googleMeetService";
import type { Booking } from "../interfaces/booking";
import { appConfig } from "../config/appConfig";

export function useCreateGoogleMeeting(
  selectedBooking: Booking | null,
  onSuccess?: (response: boolean) => void,
  onError?: (err: any) => void,
) {
  return useGoogleLogin({
    scope: appConfig.googleCalendarScope,
    onSuccess: async (tokenResponse) => {
      if (!selectedBooking) return;
      const token = tokenResponse.access_token;
      try {
        const response = await createGoogleMeeting(token, selectedBooking);
        if (onSuccess) onSuccess(response);
      } catch (err) {
        if (onError) onError(err);
      }
    },
    onError: (err) => {
      if (onError) onError(err);
    },
    flow: "implicit",
  });
}
