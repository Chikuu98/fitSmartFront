import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BadgeCheck, Clock, XCircle, Video } from "lucide-react";
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
        setBookings(data.data);
      } catch (error) {
        console.error("Failed to load bookings", error);
      }
    };

    fetchBookings();
  }, [mentorId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800 dark:text-orange-400 tracking-tight">
          My Bookings
        </h2>
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center text-gray-400 dark:text-gray-500 py-16">
              No bookings found.
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-lg rounded-2xl p-6 flex flex-col gap-3 transition hover:shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-lg text-blue-900 dark:text-orange-300">
                      {booking.member?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.member?.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.mentorSlot?.date} - {booking.mentorSlot?.start_time}{" "}
                      to {booking.mentorSlot?.end_time}
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
                      <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
                        {booking.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Payment: {booking.payment_status}
                    </span>
                  </div>
                </div>

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
                  <div className="mt-2 flex gap-3">
                    <Button
                      variant="blue"
                      onClick={() => console.log("Create Meeting", booking.id)}
                    >
                      Create Meeting
                    </Button>
                  </div>
                )}

                {booking.status === "pending" && (
                  <div className="mt-3 flex gap-3">
                    <Button
                      variant="default"
                      onClick={() => console.log("Accept", booking.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="red"
                      onClick={() => console.log("Reject", booking.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingListMentor;
