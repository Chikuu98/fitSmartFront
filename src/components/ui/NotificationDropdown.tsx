import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../api/endpoints/notifications";
import type { Notification } from "../../interfaces/notification";
import { formatRelativeTime } from "../../utils/dateUtils";

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch unread count periodically
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNotifications(1, 10);
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and polling for unread count
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // Navigate if action URL exists
    if (notification.action_url) {
      setIsOpen(false);
      navigate(notification.action_url);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
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
      const deletedNotification = notifications.find(
        (n) => n.id === notificationId
      );
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center rounded-full p-1.5 transition-colors duration-150 hover:bg-orange-100 dark:hover:bg-orange-900 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-orange-500 dark:text-orange-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#18181c] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    notification.is_read
                      ? "bg-white dark:bg-[#18181c]"
                      : "bg-orange-50 dark:bg-orange-900/20"
                  } hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0`}
                >
                  {/* Icon */}
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-medium truncate ${
                          notification.is_read
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-orange-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/notifications");
                }}
                className="w-full text-center text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
