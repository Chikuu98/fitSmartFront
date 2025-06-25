import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BadgeCheck,
  Clock,
  XCircle,
  Video,
  Mail,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { Booking } from "../../../interfaces/booking";
import { getBookingsByMentorId } from "../../../api/endpoints/bookings";
import { Button } from "../../../components/ui/button";
import type { RootState } from "../../../store/store";

const BookingListMentor: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const mentorId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (!mentorId) return;
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByMentorId(mentorId);
        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings", error);
      }
    };
    fetchBookings();
  }, [mentorId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 py-16">
              No bookings found.
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
                        {booking.payment_status}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  {booking.google_meet_link ? (
                    <a
                      href={booking.google_meet_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-700 dark:text-orange-300 hover:underline font-medium transition"
                    >
                      <Video size={16} /> Join Meeting
                    </a>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        variant="blue"
                        className="shadow-sm group-hover:scale-105 transition"
                        onClick={() =>
                          console.log("Create Meeting", booking.id)
                        }
                      >
                        Create Meeting
                      </Button>
                    </div>
                  )}

                  {booking.status === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        variant="default"
                        className="shadow-sm group-hover:scale-105 transition"
                        onClick={() => console.log("Accept", booking.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="red"
                        className="shadow-sm group-hover:scale-105 transition"
                        onClick={() => console.log("Reject", booking.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingListMentor;
