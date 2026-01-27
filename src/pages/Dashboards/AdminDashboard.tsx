import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Users,
  UserCheck,
  Clock,
  ChevronRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import type { RootState } from "../../store/store";
import { getPendingMentors } from "../../api/endpoints/users";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/unauthorized");
      return;
    }
    fetchPendingCount();
  }, [user, navigate]);

  const fetchPendingCount = async () => {
    try {
      setLoading(true);
      const response = await getPendingMentors();
      if (response.success) {
        setPendingCount(response.data.length);
      }
    } catch (error: any) {
      console.error("Error fetching pending count:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        {/* Welcome Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and monitor the FitSmart platform from your control center.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/pending-mentor-approvals")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Mentor Approvals
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? "..." : pendingCount}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  {pendingCount > 0 ? "Awaiting your review" : "All clear"}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  -
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  All registered users
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 dark:border-gray-700 sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Mentors
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  -
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Approved mentors
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
          {/* User Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  User Management
                </h2>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-2 border-orange-500 text-orange-500 bg-transparent rounded-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold hover:bg-orange-50 dark:hover:bg-orange-950 transition-all"
                onClick={() => navigate("/admin/pending-mentor-approvals")}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Pending Mentor Approvals</span>
                  <span className="sm:hidden">Pending Mentors</span>
                  {pendingCount > 0 && (
                    <span className="bg-yellow-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Community Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Community Master
                </h2>
              </div>
            </div>
            <div className="p-4 sm:p-6 flex flex-col gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-2 border-blue-500 text-blue-500 bg-transparent rounded-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                onClick={() => navigate("/admin/manage-forum-types")}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Manage Forum Types</span>
                  <span className="sm:hidden">Forum Types</span>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-2 border-blue-500 text-blue-500 bg-transparent rounded-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition-all"
                onClick={() => navigate("/admin/manage-forum-tags")}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Manage Forum Tags</span>
                  <span className="sm:hidden">Forum Tags</span>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;