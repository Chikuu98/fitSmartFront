import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Video,
  ChevronRight,
  Plus,
  Users,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { getBookingsByMemberId } from "../../api/endpoints/bookings";
import type { Booking } from "../../interfaces/booking";
import type { RootState } from "../../store/store";

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user?.role !== "member") {
      navigate("/unauthorized");
      return;
    }

    if (user?.id) {
      fetchBookings();
    }
  }, [user, navigate]);

  const fetchBookings = async () => {
    if (!user?.id) return;

    try {
      const data = await getBookingsByMemberId(user.id);
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
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

  const recentBookings = bookings
    .filter((booking) => booking.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 2);

  const stats = {
    totalSessions: bookings.filter((b) => b.status === "completed").length,
    upcomingSessions: bookings.filter(
      (b) =>
        b.status === "accepted" &&
        new Date(b.mentorSlot?.date || "") >= new Date(),
    ).length,
    pendingBookings: bookings.filter((b) => b.status === "pending").length,
    totalBookings: bookings.length,
  };

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Member"}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to continue your fitness journey? Here's your overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSessions}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Upcoming
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.upcomingSessions}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingBookings}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <Button
                variant="orange"
                onClick={() => navigate("/member/search-for-mentor")}
                className="w-full flex items-center justify-between rounded-full py-4 px-6 text-base font-semibold shadow-none hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Book New Session
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/member/my-bookings")}
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-4 px-6 text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  View My Bookings
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/member/search-for-mentor")}
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-4 px-6 text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Find Mentors
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Sessions
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/member/my-bookings")}
                >
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No upcoming sessions scheduled
                  </p>
                  <Button
                    variant="orange"
                    onClick={() => navigate("/member/search-for-mentor")}
                  >
                    Book Session Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {booking.mentorSlot?.mentor?.name ||
                              "Unknown Mentor"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
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
                        >
                          <Video className="w-4 h-4 mr-2" />
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

        {/* Recent Activity */}
        {recentBookings.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Sessions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Session with{" "}
                        {booking.mentorSlot?.mentor?.name || "Unknown Mentor"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completed on{" "}
                        {booking.mentorSlot?.date
                          ? formatDate(booking.mentorSlot.date)
                          : "Unknown date"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Completed
                      </span>
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

export default MemberDashboard;
