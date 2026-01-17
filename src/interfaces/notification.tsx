export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  read_at: string | null;
  action_url: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponse {
  data: Notification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export enum NotificationType {
  PLAN_GENERATED = 'plan_generated',
  PLAN_REMINDER = 'plan_reminder',
  WORKOUT_REMINDER = 'workout_reminder',
  MEAL_REMINDER = 'meal_reminder',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  MENTOR_MESSAGE = 'mentor_message',
  FORUM_REPLY = 'forum_reply',
  FORUM_LIKE = 'forum_like',
  SYSTEM_UPDATE = 'system_update',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
}
