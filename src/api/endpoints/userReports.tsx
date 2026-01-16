import { axiosInstance } from '../axiosInstance';
import type {
  IUserReport,
  IUserPunishment,
  CreateUserReportPayload,
  ReviewUserReportPayload,
  ApplyPunishmentPayload,
  ReportStatus,
} from '../../interfaces';

// Create a user report
export const createUserReport = async (
  payload: CreateUserReportPayload
): Promise<{ success: boolean; message: string; data: IUserReport }> => {
  const response = await axiosInstance.post('/user-reports', payload);
  return response.data;
};

// Get all reports (admin only)
export const getUserReports = async (
  page: number = 1,
  limit: number = 10,
  status?: ReportStatus
): Promise<{
  success: boolean;
  message: string;
  data: IUserReport[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  const params: any = { page, limit };
  if (status) params.status = status;
  
  const response = await axiosInstance.get('/user-reports', { params });
  return response.data;
};

// Get report statistics (admin only)
export const getReportStats = async (): Promise<{
  success: boolean;
  message: string;
  data: {
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    dismissed: number;
  };
}> => {
  const response = await axiosInstance.get('/user-reports/stats');
  return response.data;
};

// Get single report (admin only)
export const getUserReport = async (
  id: number
): Promise<{ success: boolean; message: string; data: IUserReport }> => {
  const response = await axiosInstance.get(`/user-reports/${id}`);
  return response.data;
};

// Review a report (admin only)
export const reviewUserReport = async (
  id: number,
  payload: ReviewUserReportPayload
): Promise<{ success: boolean; message: string; data: IUserReport }> => {
  const response = await axiosInstance.patch(`/user-reports/${id}/review`, payload);
  return response.data;
};

// Apply punishment (admin only)
export const applyPunishment = async (
  reportId: number,
  payload: ApplyPunishmentPayload
): Promise<{
  success: boolean;
  message: string;
  data: { punishment: IUserPunishment; report: IUserReport };
}> => {
  const response = await axiosInstance.post(
    `/user-reports/${reportId}/apply-punishment`,
    payload
  );
  return response.data;
};

// Delete a report (admin only)
export const deleteUserReport = async (
  id: number
): Promise<{ success: boolean; message: string; data: null }> => {
  const response = await axiosInstance.delete(`/user-reports/${id}`);
  return response.data;
};

// Get user punishments (admin only)
export const getUserPunishments = async (
  userId: number
): Promise<{ success: boolean; message: string; data: IUserPunishment[] }> => {
  const response = await axiosInstance.get(`/user-reports/punishments/user/${userId}`);
  return response.data;
};

// Lift a punishment (admin only)
export const liftPunishment = async (
  punishmentId: number
): Promise<{ success: boolean; message: string; data: IUserPunishment }> => {
  const response = await axiosInstance.patch(
    `/user-reports/punishments/${punishmentId}/lift`
  );
  return response.data;
};
