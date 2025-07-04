import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Users,
  UserCheck,
  UserPlus,
  BookOpen,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  BarChart3,
  Database,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import type { RootState } from "../../store/store";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/unauthorized");
      return;
    }
  }, [user, navigate]);

  // Mock data for admin dashboard - in real app, this would come from APIs
  const stats = {
    totalUsers: 1248,
    totalMembers: 892,
    totalMentors: 156,
    totalAdmins: 12,
    totalBookings: 3456,
    activeBookings: 89,
    completedBookings: 2890,
    pendingBookings: 67,
    systemHealth: 98.5,
    serverUptime: 99.9,
  };

  const recentActivity = [
    {
      id: 1,
      type: "user_registration",
      message: "New member John Doe registered",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "booking_completed",
      message: "Booking #3456 completed successfully",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "mentor_joined",
      message: "New mentor Sarah Wilson joined",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "system_update",
      message: "System maintenance completed",
      time: "2 hours ago",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return (
          <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      case "booking_completed":
        return (
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        );
      case "mentor_joined":
        return (
          <UserCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        );
      case "system_update":
        return (
          <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        );
      default:
        return (
          <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage the FitSmart platform from your control center.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ↗ +12% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                  {stats.totalBookings.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ↗ +8% this week
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Mentors
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalMentors}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  ↗ +5 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  System Health
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.systemHealth}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  All systems operational
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Members
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalMembers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Mentors
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalMentors}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Admins</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalAdmins}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Booking Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Completed
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.completedBookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {stats.activeBookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Pending
                </span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  {stats.pendingBookings}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Server Uptime
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.serverUptime}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Health Score
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.systemHealth}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Backup
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  2h ago
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Tools */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Tools
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-4 px-6 text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
                onClick={() => console.log("User management")}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  User Management
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-4 px-6 text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
                onClick={() => console.log("Analytics")}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-4 px-6 text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
                onClick={() => console.log("System settings")}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  System Settings
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-4 px-6 text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
                onClick={() => console.log("Database")}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5" />
                  Database
                </div>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-orange-100">
                Manage your platform efficiently
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => console.log("Add user")}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => console.log("View reports")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </Button>
              <Button
                variant="outline"
                className="bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => console.log("System health")}
              >
                <Activity className="w-4 h-4 mr-2" />
                System Health
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
