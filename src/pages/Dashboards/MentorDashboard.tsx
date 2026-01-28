import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Users,
  CheckCircle,
  Video,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { getBookingsByMentorId } from "../../api/endpoints/bookings";
import { getMentorSlots } from "../../api/endpoints/mentorSlots";
import type { Booking } from "../../interfaces/booking";
import type { MentorSlot } from "../../interfaces/mentorSlot";
import type { RootState } from "../../store/store";

const MentorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<MentorSlot[]>([]);

  useEffect(() => {
    if (user?.role !== "mentor") {
      navigate("/unauthorized");
      return;
    }

    if (user?.id) {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      const [bookingsResponse, slotsResponse] = await Promise.all([
        getBookingsByMentorId(user.id),
        getMentorSlots(user.id),
      ]);
      setBookings(bookingsResponse.data || []);
      setSlots(slotsResponse.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setBookings([]);
      setSlots([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const pendingBookings = bookings
    .filter((booking) => booking.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .slice(0, 3);

  const upcomingBookings = bookings
    .filter(
      (booking) =>
        booking.status === "accepted" &&
        new Date(booking.mentorSlot?.date || "") >= new Date(),
    )
    .sort(
      (a, b) =>
        new Date(a.mentorSlot?.date || "").getTime() -
        new Date(b.mentorSlot?.date || "").getTime(),
    )
    .slice(0, 3);

  const availableSlots = slots.filter(
    (slot) => !slot.is_booked && new Date(slot.date) >= new Date(),
  ).length;

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    acceptedBookings: bookings.filter((b) => b.status === "accepted").length,
    completedSessions: bookings.filter((b) => b.status === "completed").length,
    availableSlots,
    totalSlots: slots.length,
  };

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        {/* Welcome Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Mentor"}! 💪
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Ready to guide your members? Here's your mentoring overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Bookings
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Reviews
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingBookings}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Upcoming Sessions
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.acceptedBookings}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Available Slots
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.availableSlots}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
              <Button
                variant="orange"
                onClick={() => navigate("/mentor/create-slot")}
                className="w-full flex items-center justify-between rounded-full py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold shadow-none hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Create Time Slot</span>
                  <span className="sm:hidden">Create Slot</span>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/mentor/my-bookings")}
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Review Bookings</span>
                  <span className="sm:hidden">Bookings</span>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/mentor/my-slots")}
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Manage Slots</span>
                  <span className="sm:hidden">Slots</span>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Pending Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pending Bookings
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/mentor/booking-list")}
                >
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              {pendingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No pending bookings to review
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.member?.name || "Unknown Member"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.mentorSlot?.date &&
                            booking.mentorSlot?.start_time
                              ? `${formatDate(booking.mentorSlot.date)} at ${formatTime(booking.mentorSlot.start_time)}`
                              : "Date & Time TBD"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="orange"
                        onClick={() => navigate("/mentor/booking-list")}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        {upcomingBookings.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upcoming Sessions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Session with{" "}
                          {booking.member?.name || "Unknown Member"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.mentorSlot?.date &&
                          booking.mentorSlot?.start_time
                            ? `${formatDate(booking.mentorSlot.date)} at ${formatTime(booking.mentorSlot.start_time)}`
                            : "Date & Time TBD"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.google_meet_link && (
                        <Button
                          variant="blue"
                          onClick={() =>
                            window.open(booking.google_meet_link, "_blank")
                          }
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
