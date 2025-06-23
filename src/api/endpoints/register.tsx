import { axiosInstance } from "../axiosInstance";

export const registerMember = async (data: {
  name: string;
  email: string;
  password: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  fitness_level: string;
  goal: string;
  dietary_preference: string;
}) => {
  const response = await axiosInstance.post("/auth/register/member", data);
  return response.data;
};

export const registerMentor = async (data: {
  name: string;
  email: string;
  password: string;
  gender: string;
  expertise: string;
  bio: string;
  certifications: string;
  social_links: string;
  contact_number: string;
}) => {
  const response = await axiosInstance.post("/auth/register/mentor", data);
  return response.data;
};
