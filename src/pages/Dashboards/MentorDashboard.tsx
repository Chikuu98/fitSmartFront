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
    upcomingBookings: upcomingBookings.length,
    availableSlots,
  };

  return (
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Mentor"}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your mentoring activities and sessions
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Session Summary Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Session Summary
              </h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBookings}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingBookings}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Pending</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.upcomingBookings}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Upcoming</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.availableSlots}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Available</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/mentor/create-slot")}
                className="h-auto py-3 px-4 flex items-center justify-between border hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium">Create Time Slot</span>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/mentor/my-bookings")}
                className="h-auto py-3 px-4 flex items-center justify-between border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Review Bookings</span>
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/mentor/my-slots")}
                className="h-auto py-3 px-4 flex items-center justify-between border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm font-medium">Manage My Slots</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Pending Bookings and Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Pending Bookings
                </h2>
                {pendingBookings.length > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/mentor/booking-list")}
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    View All
                  </Button>
                )}
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
                <div className="space-y-3">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {booking.member?.name || "Unknown Member"}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
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
                        className="text-sm py-1.5 px-3"
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Upcoming Sessions
              </h2>
            </div>
            <div className="p-6">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No upcoming sessions scheduled
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {booking.member?.name || "Unknown Member"}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {booking.mentorSlot?.date &&
                            booking.mentorSlot?.start_time
                              ? `${formatDate(booking.mentorSlot.date)} at ${formatTime(booking.mentorSlot.start_time)}`
                              : "Date & Time TBD"}
                          </p>
                        </div>
                      </div>
                      {booking.google_meet_link && (
                        <Button
                          variant="blue"
                          onClick={() =>
                            window.open(booking.google_meet_link, "_blank")
                          }
                          className="text-sm py-1.5 px-3 flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
