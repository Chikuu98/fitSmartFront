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
  FileText,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import type { RootState } from "../../store/store";
import { getPendingMentors, getAllUsers, getAllMentors } from "../../api/endpoints/users";
import { UserAccountStatus } from "../../enums/userDetailEnums";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeMentors, setActiveMentors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/unauthorized");
      return;
    }
    fetchDashboardStats();
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const pendingResponse = await getPendingMentors(1, 1000);
      if (pendingResponse.success) {
        setPendingCount(pendingResponse.data.length);
      }
      
      const usersResponse = await getAllUsers();
      if (usersResponse.success) {
        setTotalUsers(usersResponse.data.length);
      }
      
      const mentorsResponse = await getAllMentors(UserAccountStatus.ACTIVE);
      if (mentorsResponse.success) {
        setActiveMentors(mentorsResponse.data.length);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor the FitSmart platform
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Platform Overview Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Platform Overview
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalUsers}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Users</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeMentors}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Mentors</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingCount}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Pending</p>
              </div>
            </div>
          </div>

          {/* Action Required Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Action Required</h2>
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                onClick={() => navigate("/admin/pending-mentor-approvals")}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mentor Approvals</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{pendingCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/pending-mentor-approvals")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
              >
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-medium">Approvals</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/user-reports")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium">Reports</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/manage-forum-types")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950"
              >
                <Tag className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium">Forum Types</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/manage-forum-tags")}
                className="h-auto py-2 px-2 flex flex-col items-center gap-1 border hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                <Tag className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-medium">Forum Tags</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
                User Management
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => navigate("/admin/pending-mentor-approvals")}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Pending Mentor Approvals</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Review and approve new mentors</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => navigate("/admin/user-reports")}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">User Reports</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">View user activity reports</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Community Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-500" />
                Community Master
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <div 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => navigate("/admin/manage-forum-types")}
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Manage Forum Types</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Configure forum categories</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => navigate("/admin/manage-forum-tags")}
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Manage Forum Tags</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Create and edit forum tags</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;