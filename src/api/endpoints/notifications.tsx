import { axiosInstance } from "../axiosInstance";
import type {
  NotificationResponse,
  UnreadCountResponse,
} from "../../interfaces/notification";

export const getNotifications = async (
  page = 1,
  limit = 20
): Promise<NotificationResponse> => {
  const response = await axiosInstance.get("/notifications", {
    params: { page, limit },
  });
  return response.data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await axiosInstance.get("/notifications/unread-count");
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.patch(
    `/notifications/${notificationId}/read`,
    {},
    { skipToast: true } as any
  );
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axiosInstance.patch(
    "/notifications/read-all",
    {},
    { skipToast: true } as any
  );
  return response.data;
};

export const deleteNotification = async (
  notificationId: number
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(
    `/notifications/${notificationId}`,
    { skipToast: true } as any
  );
  return response.data;
};
