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
} from "../../interfaces/user";

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get("/users/me");
  return response.data;
};

// Alias for getCurrentUser
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
