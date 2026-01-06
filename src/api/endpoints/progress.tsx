import { axiosInstance } from '../axiosInstance';
import type {
  DailyProgress,
  CreateDailyProgressDto,
  TodaysPlanDetails,
  BatchProgressDto,
  ProgressSummary,
} from '../../interfaces/progress';

export const createDailyProgress = async (
  acceptedPlanId: number,
  data: CreateDailyProgressDto
): Promise<DailyProgress> => {
  const response = await axiosInstance.post(`/progress/daily/${acceptedPlanId}`, data);
  return response.data;
};

export const getDailyProgress = async (
  acceptedPlanId: number,
  startDate?: string,
  endDate?: string
): Promise<DailyProgress[]> => {
  const response = await axiosInstance.get(`/progress/daily/${acceptedPlanId}`, {
    params: { startDate, endDate },
  });
  return response.data;
};

export const getTodaysPlanDetails = async (acceptedPlanId: number): Promise<TodaysPlanDetails> => {
  const response = await axiosInstance.get(`/progress/today/${acceptedPlanId}`);
  return response.data;
};

export const saveBatchProgress = async (
  acceptedPlanId: number,
  data: BatchProgressDto,
  progressDate?: string,
  dayNumber?: number
): Promise<DailyProgress> => {
  const response = await axiosInstance.post(`/progress/batch/${acceptedPlanId}`, data, {
    params: { progressDate, dayNumber },
  });
  return response.data;
};

export const updateDailyProgress = async (
  progressId: number,
  data: Partial<CreateDailyProgressDto>
): Promise<DailyProgress> => {
  const response = await axiosInstance.put(`/progress/daily/${progressId}`, data);
  return response.data;
};

export const deleteDailyProgress = async (progressId: number): Promise<void> => {
  await axiosInstance.delete(`/progress/daily/${progressId}`);
};

export const getProgressSummary = async (acceptedPlanId: number): Promise<ProgressSummary> => {
  const response = await axiosInstance.get(`/progress/summary/${acceptedPlanId}`);
  return response.data;
};
