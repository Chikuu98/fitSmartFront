import { axiosInstance } from "../axiosInstance";
import type {
  User,
  UpdateUserDto,
  UpdateMemberDetailsDto,
  UpdateMentorDetailsDto,
  CreateCertificationDto,
  UpdateCertificationDto,
  CreateSocialLinkDto,
  UpdateSocialLinkDto,
  UpdateUserStatusDto,
} from "../../interfaces/user";
import { UserAccountStatus } from "../../enums/userDetailEnums";

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

export const getUserProfile = getCurrentUser;

export const updateUser = async (userData: UpdateUserDto) => {
  const response = await axiosInstance.put("/users/me", userData);
  return response.data;
};

export const updateMemberDetails = async (
  memberData: UpdateMemberDetailsDto,
) => {
  const response = await axiosInstance.put(
    "/users/member/member-details",
    memberData,
  );
  return response.data;
};

export const updateMentorDetails = async (
  mentorData: UpdateMentorDetailsDto,
) => {
  const response = await axiosInstance.put(
    "/users/mentor/mentor-details",
    mentorData,
  );
  return response.data;
};

export const addCertification = async (certData: CreateCertificationDto) => {
  const response = await axiosInstance.post(
    "/users/mentor/certifications",
    certData,
  );
  return response.data;
};

export const updateCertification = async (
  id: number,
  certData: UpdateCertificationDto,
) => {
  const response = await axiosInstance.put(
    `/users/mentor/certifications/${id}`,
    certData,
  );
  return response.data;
};

export const addSocialLink = async (linkData: CreateSocialLinkDto) => {
  const response = await axiosInstance.post(
    "/users/mentor/social-links",
    linkData,
  );
  return response.data;
};

export const updateSocialLink = async (
  id: number,
  linkData: UpdateSocialLinkDto,
) => {
  const response = await axiosInstance.put(
    `/users/mentor/social-links/${id}`,
    linkData,
  );
  return response.data;
};

export const getPendingMentors = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(`/users/admin/pending-mentors?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAllMentors = async (status?: UserAccountStatus) => {
  const params = status ? { status } : {};
  const response = await axiosInstance.get("/users/admin/mentors", { params });
  return response.data;
};

export const updateUserStatus = async (
  userId: number,
  statusData: UpdateUserStatusDto,
) => {
  const response = await axiosInstance.put(
    `/users/admin/users/${userId}/status`,
    statusData,
  );
  return response.data;
};
