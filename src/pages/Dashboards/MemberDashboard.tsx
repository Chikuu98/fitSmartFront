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
  MessageSquare,
  Heart,
  TrendingUp,
  Dumbbell,
  UtensilsCrossed,
  Target,
  Award,
  Activity,
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

  // Hardcoded Forum Stats
  const forumStats = {
    threadsCreated: 12,
    repliesMade: 45,
    likesReceived: 89,
    helpfulVotes: 34,
  };

  // Hardcoded Plan Stats
  const planStats = {
    activeWorkoutPlan: true,
    activeMealPlan: true,
    workoutCompletionRate: 78,
    mealPlanAdherence: 85,
    totalWorkoutsCompleted: 156,
    currentStreak: 7,
  };

  // Hardcoded Recent Forum Threads
  const recentForumThreads = [
    {
      id: 1,
      title: "Best protein powder for muscle gain?",
      type: "Nutrition",
      replies: 23,
      likes: 45,
      createdAt: "2026-01-01T10:30:00",
      author: "You",
    },
    {
      id: 2,
      title: "How to improve squat form?",
      type: "Training",
      replies: 15,
      likes: 32,
      createdAt: "2025-12-28T14:20:00",
      author: "You",
    },
    {
      id: 3,
      title: "Recovery techniques after intense workouts",
      type: "Recovery",
      replies: 18,
      likes: 28,
      createdAt: "2025-12-25T09:15:00",
      author: "You",
    },
  ];

  // Hardcoded Active Plans
  const activePlans = [
    {
      id: 1,
      type: "Workout",
      name: "Strength Building Program",
      progress: 78,
      daysCompleted: 23,
      totalDays: 30,
      nextWorkout: "Upper Body Strength",
      scheduledFor: "2026-01-03T06:00:00",
    },
    {
      id: 2,
      type: "Meal",
      name: "High Protein Meal Plan",
      progress: 85,
      daysCompleted: 25,
      totalDays: 30,
      nextMeal: "Grilled Chicken & Quinoa",
      scheduledFor: "2026-01-02T12:00:00",
    },
  ];

  // Hardcoded Recent Workout Activities
  const recentActivities = [
    {
      id: 1,
      type: "workout",
      title: "Full Body Strength",
      completedAt: "2026-01-02T07:30:00",
      duration: "45 min",
      calories: 320,
    },
    {
      id: 2,
      type: "workout",
      title: "Cardio HIIT Session",
      completedAt: "2026-01-01T18:00:00",
      duration: "30 min",
      calories: 280,
    },
    {
      id: 3,
      type: "meal",
      title: "Meal Plan Day 25 Completed",
      completedAt: "2026-01-01T20:00:00",
      calories: 2200,
    },
  ];

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Member"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to continue your fitness journey? Here's your overview.
          </p>
        </div>

        {/* Stats Cards - Sessions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Session Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>

        {/* Stats Cards - Forum */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Forum Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Threads Created
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {forumStats.threadsCreated}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Replies Made
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {forumStats.repliesMade}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Likes Received
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {forumStats.likesReceived}
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Helpful Votes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {forumStats.helpfulVotes}
                  </p>
                </div>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Plans */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Fitness Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Workout Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {planStats.workoutCompletionRate}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Meal Adherence
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {planStats.mealPlanAdherence}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Workouts
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {planStats.totalWorkoutsCompleted}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {planStats.currentStreak} days
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <Button
                variant="orange"
                onClick={() => navigate("/member/search-for-mentor")}
                className="w-full flex items-center justify-between rounded-full py-3 px-6 text-base font-semibold shadow-none hover:shadow-md transition-all"
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
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-3 px-6 text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
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
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-3 px-6 text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Find Mentors
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/community-forum")}
                className="w-full flex items-center justify-between border-2 border-purple-500 text-purple-500 bg-transparent rounded-full py-3 px-6 text-base font-semibold hover:bg-purple-50 dark:hover:bg-purple-950 transition-all"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  Visit Forum
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/member/my-plans")}
                className="w-full flex items-center justify-between border-2 border-blue-500 text-blue-500 bg-transparent rounded-full py-3 px-6 text-base font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-5 h-5" />
                  My Fitness Plans
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

        {/* Active Plans Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workout Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Active Workout Plan
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/member/my-plans")}
                >
                  View Details
                </Button>
              </div>
            </div>
            <div className="p-6">
              {activePlans[0] && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {activePlans[0].name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>
                        Day {activePlans[0].daysCompleted} of{" "}
                        {activePlans[0].totalDays}
                      </span>
                      <span>{activePlans[0].progress}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-orange-500 h-2.5 rounded-full"
                        style={{ width: `${activePlans[0].progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Next Workout
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {activePlans[0].nextWorkout}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Scheduled:{" "}
                      {new Date(
                        activePlans[0].scheduledFor,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="orange"
                      className="flex-1"
                      onClick={() => navigate("/member/my-plans")}
                    >
                      Start Workout
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/member/my-plans")}
                    >
                      View Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meal Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5" />
                  Active Meal Plan
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/member/my-plans")}
                >
                  View Details
                </Button>
              </div>
            </div>
            <div className="p-6">
              {activePlans[1] && (
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {activePlans[1].name}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>
                        Day {activePlans[1].daysCompleted} of{" "}
                        {activePlans[1].totalDays}
                      </span>
                      <span>{activePlans[1].progress}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${activePlans[1].progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Next Meal
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {activePlans[1].nextMeal}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Scheduled:{" "}
                      {new Date(
                        activePlans[1].scheduledFor,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="orange"
                      className="flex-1"
                      onClick={() => navigate("/member/my-plans")}
                    >
                      View Meal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/member/my-plans")}
                    >
                      View Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Forum Activity & Recent Activities */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Forum Threads */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  My Forum Threads
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/community-forum")}
                >
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentForumThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => navigate("/community-forum")}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white flex-1">
                        {thread.title}
                      </h3>
                      <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded-full ml-2">
                        {thread.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {thread.replies} replies
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {thread.likes} likes
                      </span>
                      <span>
                        {new Date(thread.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Workout Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activities
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 ${
                        activity.type === "workout"
                          ? "bg-orange-100 dark:bg-orange-900"
                          : "bg-green-100 dark:bg-green-900"
                      } rounded-full flex items-center justify-center`}
                    >
                      {activity.type === "workout" ? (
                        <Dumbbell
                          className={`w-5 h-5 ${
                            activity.type === "workout"
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        />
                      ) : (
                        <UtensilsCrossed className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.type === "workout"
                          ? `${activity.duration} • ${activity.calories} cal`
                          : `${activity.calories} cal`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(activity.completedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
