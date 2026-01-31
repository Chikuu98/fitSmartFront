import { axiosInstance } from '../axiosInstance';
import type { GeneratePlanDto, GeneratedPlan, AcceptPlanDto, AcceptedPlan, PlanType } from '../../interfaces/plan';

export const generatePlan = async (data: GeneratePlanDto): Promise<GeneratedPlan> => {
  const response = await axiosInstance.post('/plans/generate', data);
  return response.data.data || response.data;
};

export const acceptPlan = async (planId: number, data: AcceptPlanDto) => {
  const response = await axiosInstance.post(`/plans/${planId}/accept`, data);
  return response.data.data || response.data;
};

export const getGeneratedPlans = async (limit?: number, offset?: number) => {
  const response = await axiosInstance.get('/plans/generated', {
    params: { limit, offset }
  });
  return response.data;
};

export const getAcceptedPlans = async (
  status?: string,
  page: number = 1,
  limit: number = 10
) => {
  const response = await axiosInstance.get('/plans/accepted', {
    params: { status, page, limit }
  });
  return response.data;
};

export const getGeneratedPlan = async (planId: number): Promise<GeneratedPlan> => {
  const response = await axiosInstance.get(`/plans/generated/${planId}`);
  return response.data;
};

export const getAcceptedPlan = async (planId: number) => {
  const response = await axiosInstance.get(`/plans/accepted/${planId}`);
  return response.data;
};

export const deleteGeneratedPlan = async (planId: number) => {
  const response = await axiosInstance.delete(`/plans/generated/${planId}`);
  return response.data;
};

export const cancelAcceptedPlan = async (planId: number) => {
  const response = await axiosInstance.delete(`/plans/accepted/${planId}`);
  return response.data;
};

export const activatePlan = async (planId: number) => {
  const response = await axiosInstance.post(`/plans/accepted/${planId}/activate`);
  return response.data;
};

export const pausePlan = async (planId: number) => {
  const response = await axiosInstance.post(`/plans/accepted/${planId}/pause`);
  return response.data;
};

export const resumePlan = async (planId: number) => {
  const response = await axiosInstance.post(`/plans/accepted/${planId}/resume`);
  return response.data;
};

export const getPlanTypes = async (): Promise<PlanType[]> => {
  const response = await axiosInstance.get('/plans/types');
  return response.data;
};
