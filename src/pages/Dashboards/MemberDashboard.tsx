import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Plus,
  Users,
  CheckCircle,
  MessageSquare,
  Heart,
  Dumbbell,
  UtensilsCrossed,
  Target,
  Award,
  Activity,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { getMemberDashboard, type MemberDashboardData } from "../../api/endpoints/dashboard";
import type { RootState } from "../../store/store";
import { formatRelativeTime } from "../../utils/dateUtils";

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [dashboardData, setDashboardData] = useState<MemberDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "member") {
      navigate("/unauthorized");
      return;
    }

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getMemberDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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

  const stats = dashboardData?.sessionStats || {
    totalSessions: 0,
    upcomingSessions: 0,
    pendingBookings: 0,
    totalBookings: 0,
  };

  const forumStats = dashboardData?.forumStats || {
    threadsCreated: 0,
    repliesMade: 0,
    likesReceived: 0,
    helpfulVotes: 0,
  };

  const planStats = dashboardData?.planStats || {
    activeWorkoutPlan: false,
    activeMealPlan: false,
    workoutCompletionRate: 0,
    mealPlanAdherence: 0,
    totalWorkoutsCompleted: 0,
    currentStreak: 0,
  };

  const recentForumThreads = dashboardData?.recentForumThreads || [];
  const activePlansData = dashboardData?.activePlans || [];
  const upcomingBookings = dashboardData?.upcomingBookings || [];
  const recentBookings = dashboardData?.recentBookings || [];

  return (
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <>
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Member"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your fitness journey overview
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Fitness Progress Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-orange-500" />
                Fitness Progress
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/member/my-plans")}
                className="text-orange-500 hover:text-orange-600"
              >
                View Plans →
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                <Dumbbell className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {planStats.workoutCompletionRate}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Workout Progress</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <UtensilsCrossed className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {planStats.mealPlanAdherence}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Meal Adherence</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {planStats.totalWorkoutsCompleted}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Workouts Done</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {planStats.currentStreak}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Session Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Sessions
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/member/my-bookings")}
                className="text-blue-500 hover:text-blue-600"
              >
                View All →
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upcoming</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.upcomingSessions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.pendingBookings}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalSessions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/member/search-for-mentor")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
              >
                <Plus className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium">Book Session</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/member/my-plans")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <Dumbbell className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium">My Plans</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/member/my-bookings")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950"
              >
                <BookOpen className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium">Bookings</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/community-forum")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
              >
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium">Forum</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/member/search-for-mentor")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-medium">Find Mentors</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Active Plans & Community Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Plans Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Plans</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/member/my-plans")}
                  className="text-orange-500 hover:text-orange-600"
                >
                  View All →
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Workout Plan */}
              {activePlansData[0] ? (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-orange-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">{activePlansData[0].name}</h3>
                    </div>
                    <span className="text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full">
                      {Math.round(activePlansData[0].progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${Math.round(activePlansData[0].progress)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Day {activePlansData[0].daysCompleted} of {activePlansData[0].totalDays}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center">
                  <Dumbbell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">No active workout plan</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/member/my-plans")}
                  >
                    Create Plan
                  </Button>
                </div>
              )}

              {/* Meal Plan */}
              {activePlansData[1] ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-5 h-5 text-green-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">{activePlansData[1].name}</h3>
                    </div>
                    <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      {Math.round(activePlansData[1].progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.round(activePlansData[1].progress)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Day {activePlansData[1].daysCompleted} of {activePlansData[1].totalDays}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center">
                  <UtensilsCrossed className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">No active meal plan</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/member/my-plans")}
                  >
                    Create Plan
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Community & Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  Community Activity
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/community-forum")}
                  className="text-purple-500 hover:text-purple-600"
                >
                  Visit Forum →
                </Button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{forumStats.threadsCreated}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Threads</p>
                </div>
                <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{forumStats.repliesMade}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Replies</p>
                </div>
                <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{forumStats.likesReceived}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Likes</p>
                </div>
                <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{forumStats.helpfulVotes}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Helpful</p>
                </div>
              </div>
              
              {recentForumThreads.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Threads</p>
                  {recentForumThreads.slice(0, 2).map((thread) => (
                    <div
                      key={thread.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => navigate("/community-forum")}
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 line-clamp-1">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {thread.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {thread.likes}
                        </span>
                        <span>{formatRelativeTime(thread.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">No forum activity yet</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/community-forum")}
                  >
                    Start Discussion
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming & Recent Sessions */}
        {(upcomingBookings.length > 0 || recentBookings.length > 0) && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            {upcomingBookings.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Upcoming Sessions
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {upcomingBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {booking.mentorName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(booking.date)} at {formatTime(booking.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Sessions */}
            {recentBookings.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Recent Sessions
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {recentBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {booking.mentorName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(booking.date)}
                        </p>
                      </div>
                      <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
