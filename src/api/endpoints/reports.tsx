import { axiosInstance } from '../axiosInstance';
import type { MemberProgressReport, GenerateReportRequest } from '../../interfaces/report';

export const generateMemberReport = async (
  data: GenerateReportRequest
): Promise<MemberProgressReport> => {
  const response = await axiosInstance.post('/reports/member/generate', data);
  return response.data.data;
};
