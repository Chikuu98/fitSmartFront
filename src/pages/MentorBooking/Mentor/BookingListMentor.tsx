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
    <div className="min-h-screen text-white p-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-orange-100 dark:bg-orange-400 text-black p-4 rounded-2xl shadow-md border border-neutral"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-lg">{booking.member?.name}</p>
                <p className="text-sm text-gray-600">{booking.member?.email}</p>
                <p className="text-sm text-gray-600">
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
                  <span className="capitalize text-sm">{booking.status}</span>
                </div>
                <span className="text-xs text-gray-500">
                  Payment: {booking.payment_status}
                </span>
              </div>
            </div>

            {booking.google_meet_link ? (
              <a
                href={booking.google_meet_link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 flex items-center gap-2 text-sm mt-2"
              >
                <Video size={16} /> Join Meeting
              </a>
            ) : (
              <div className="mt-3 flex gap-3">
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
        ))}
      </div>
    </div>
  );
};

export default BookingListMentor;
