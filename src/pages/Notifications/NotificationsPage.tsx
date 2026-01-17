import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../api/endpoints/notifications";
import type { Notification } from "../../interfaces/notification";
import { formatRelativeTime } from "../../utils/dateUtils";
import { Button } from "../../components/ui/button";
import { usePagination } from "../../hooks/usePagination";

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    currentPage,
    pagination,
    setPagination,
    handlePrevPage,
    handleNextPage,
  } = usePagination({ initialPage: 1, initialItemsPerPage: 15 });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNotifications(currentPage, 15);
      setNotifications(response.data);
      setPagination({
        page: response.meta.page,
        limit: response.meta.limit,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
        hasNext: response.meta.page < response.meta.totalPages,
        hasPrev: response.meta.page > 1,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, setPagination]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
    }

    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificationId: number
  ) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking_confirmed":
        return "✅";
      case "booking_cancelled":
        return "❌";
      case "forum_reply":
        return "💬";
      case "forum_like":
        return "❤️";
      case "plan_generated":
        return "🏋️";
      case "mentor_message":
        return "📨";
      case "system_update":
        return "🔔";
      default:
        return "📢";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                No notifications
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-4 p-4 cursor-pointer transition-colors ${
                    notification.is_read
                      ? "bg-white dark:bg-gray-800"
                      : "bg-orange-50 dark:bg-orange-900/20"
                  } hover:bg-gray-50 dark:hover:bg-gray-750`}
                >
                  {/* Icon */}
                  <span className="text-2xl flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`text-base font-medium ${
                            notification.is_read
                              ? "text-gray-700 dark:text-gray-300"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.is_read && (
                          <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                        )}
                        <button
                          onClick={(e) =>
                            handleDeleteNotification(e, notification.id)
                          }
                          className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevPage}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextPage}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
