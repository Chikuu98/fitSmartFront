import { axiosInstance } from '../axiosInstance';

export interface SessionStats {
  totalSessions: number;
  upcomingSessions: number;
  pendingBookings: number;
  totalBookings: number;
}

export interface ForumStats {
  threadsCreated: number;
  repliesMade: number;
  likesReceived: number;
  helpfulVotes: number;
}

export interface PlanStats {
  activeWorkoutPlan: boolean;
  activeMealPlan: boolean;
  workoutCompletionRate: number;
  mealPlanAdherence: number;
  totalWorkoutsCompleted: number;
  currentStreak: number;
}

export interface RecentForumThread {
  id: number;
  title: string;
  type: string;
  replies: number;
  likes: number;
  createdAt: string;
  author: string;
}

export interface ActivePlanData {
  id: number;
  type: 'Workout' | 'Meal';
  name: string;
  progress: number;
  daysCompleted: number;
  totalDays: number;
  planStartDate: string;
  planEndDate: string;
}

export interface RecentActivity {
  id: string;
  type: 'workout' | 'meal';
  title: string;
  completedAt: string;
  duration?: string;
  calories?: number;
}

export interface UpcomingBooking {
  id: number;
  mentorName: string;
  mentorAvatar?: string;
  date: string;
  time: string;
  status: string;
}

export interface RecentBooking {
  id: number;
  mentorName: string;
  mentorAvatar?: string;
  date: string;
  time: string;
  status: string;
}

export interface MemberDashboardData {
  sessionStats: SessionStats;
  forumStats: ForumStats;
  planStats: PlanStats;
  recentForumThreads: RecentForumThread[];
  activePlans: ActivePlanData[];
  recentActivities: RecentActivity[];
  upcomingBookings: UpcomingBooking[];
  recentBookings: RecentBooking[];
}

export const getMemberDashboard = async (): Promise<MemberDashboardData> => {
  const response = await axiosInstance.get('/dashboard/member');
  return response.data.data;
};
