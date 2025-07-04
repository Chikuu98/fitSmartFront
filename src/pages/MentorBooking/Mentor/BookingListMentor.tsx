import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Clock,
  XCircle,
  Video,
  Mail,
  Calendar,
  CreditCard,
  AlertCircle,
  Edit,
} from "lucide-react";
import type { Booking } from "../../../interfaces/booking";
import { getBookingsByMentorId } from "../../../api/endpoints/bookings";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import type { RootState } from "../../../store/store";
import { useCreateGoogleMeeting } from "../../../hooks/useCreateGoogleMeeting";
import { acceptBooking, cancelBooking } from "../../../api/endpoints/bookings";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui";

const BookingListMentor: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const mentor_id = useSelector((state: RootState) => state.auth.user?.id);
  const { openDialog, ConfirmDialog } = useConfirmationDialog();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mentor_id) return;
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByMentorId(mentor_id);
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings", error);
      }
    };
    fetchBookings();
  }, [mentor_id]);

  const handleMeetingSuccess = () => {
    refetchBookings();
  };

  const handleMeetingError = (err: any) => {
    console.error(err);
  };

  const refetchBookings = async () => {
    if (!mentor_id) return;
    try {
      const data = await getBookingsByMentorId(mentor_id);
      setBookings(data);
    } catch (error) {
      toast.error("Failed to reload bookings");
    }
  };

  const handleAccept = async (booking: Booking) => {
    if (!booking.google_meet_link) {
      toast.info("You must create a meeting before accepting.");
      return;
    }

    openDialog({
      title: "Accept Booking",
      message: `Are you sure you want to accept the booking with ${booking.member?.name}?`,
      confirmText: "Accept",
      cancelText: "Cancel",
      variant: "info",
      loading: loadingId === booking.id,
      onConfirm: async (close) => {
        close();
        setLoadingId(booking.id);
        try {
          await acceptBooking(booking.id, booking.google_meet_link!);
          refetchBookings();
        } catch (err) {
        } finally {
          setLoadingId(null);
        }
      },
    });
  };

  const handleCancel = async (booking: Booking) => {
    openDialog({
      title: "Cancel Booking",
      message: `Are you sure you want to cancel the booking with ${booking.member?.name}? This action cannot be undone.`,
      confirmText: "Cancel Booking",
      cancelText: "Keep Booking",
      variant: "danger",
      loading: loadingId === booking.id,
      onConfirm: async (close) => {
        close();
        setLoadingId(booking.id);
        try {
          await cancelBooking(booking.id);
          refetchBookings();
        } catch (err) {
        } finally {
          setLoadingId(null);
        }
      },
    });
  };

  const createMeeting = useCreateGoogleMeeting(
    selectedBooking,
    handleMeetingSuccess,
    handleMeetingError,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-orange-100 mb-2">
                No bookings found
              </h3>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white/90 dark:bg-[#18181c] border border-gray-200 dark:border-orange-800 shadow-xl rounded-2xl p-5 flex flex-col gap-4 transition hover:shadow-2xl hover:border-blue-300 dark:hover:border-orange-400 group relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-1">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-lg text-blue-900 dark:text-orange-200 flex items-center gap-2">
                      {booking.member?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {booking.member?.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {booking.mentorSlot?.date} &bull;{" "}
                      {booking.mentorSlot?.start_time} -{" "}
                      {booking.mentorSlot?.end_time}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-2 items-center">
                      {booking.status === "accepted" && (
                        <BadgeCheck className="text-green-500" />
                      )}
                      {booking.status === "pending" && (
                        <Clock className="text-yellow-500" />
                      )}
                      {booking.status === "rejected" && (
                        <XCircle className="text-red-500" />
                      )}
                      <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-orange-950 text-blue-800 dark:text-orange-200 border border-blue-200 dark:border-orange-800">
                        {booking.status}
                      </span>
                    </div>
                    <span className="text-xs flex items-center gap-1 text-gray-500 dark:text-gray-300 mt-1">
                      <CreditCard className="w-4 h-4" /> Payment:{" "}
                      <span className="font-medium text-gray-700 dark:text-orange-200">
                        {booking.bookingPayment && booking.bookingPayment.status
                          ? booking.bookingPayment.status
                              .charAt(0)
                              .toUpperCase() +
                            booking.bookingPayment.status.slice(1)
                          : "Unpaid"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex items-center gap-4">
                    {booking.google_meet_link ? (
                      <a
                        href={booking.google_meet_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-700 dark:text-orange-300 hover:underline font-medium transition"
                      >
                        <Video size={16} /> Join Meeting
                      </a>
                    ) : null}

                    <Button
                      variant="outline"
                      className="shadow-sm group-hover:scale-105 transition text-xs px-3 py-1"
                      onClick={() =>
                        navigate(`/mentor/bookings/update/${booking.id}`)
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  {booking.status === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        variant="blue"
                        className="shadow-sm group-hover:scale-105 transition"
                        disabled={loadingId === booking.id}
                        onClick={() => {
                          setSelectedBooking(booking);
                          createMeeting();
                        }}
                      >
                        {loadingId === booking.id
                          ? "Creating..."
                          : booking.google_meet_link
                            ? "Meeting Created"
                            : "Create Meeting"}
                      </Button>
                      <Button
                        variant="true"
                        className="shadow-sm group-hover:scale-105 transition"
                        disabled={loadingId === booking.id}
                        onClick={() => handleAccept(booking)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="red"
                        className="shadow-sm group-hover:scale-105 transition"
                        disabled={loadingId === booking.id}
                        onClick={() => handleCancel(booking)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default BookingListMentor;
