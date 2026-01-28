import type {
  Mentor,
  MentorListFilters,
  MentorListResponse,
} from "../../interfaces/mentor";
import { axiosInstance } from "../axiosInstance";

export const getMentorList = async (
  filters?: MentorListFilters,
  page: number = 1,
  limit: number = 10,
) => {
  try {
    const params = new URLSearchParams();

    if (filters?.country) {
      params.append("country", filters.country);
    }
    if (filters?.language) {
      params.append("language", filters.language);
    }
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = `/users/mentors/filter?${queryString}`;

    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error) {
    console.error("Error fetching mentor list:", error);
    throw error;
  }
};

export const getMentorsByCountry = async (
  country: string,
  page?: number,
  limit?: number,
) => {
  return getMentorList({ country }, page, limit);
};

export const getMentorsByLanguage = async (
  language: string,
  page?: number,
  limit?: number,
) => {
  return getMentorList({ language }, page, limit);
};

export const getMentorsByCountryAndLanguage = async (
  country: string,
  language: string,
  page?: number,
  limit?: number,
) => {
  return getMentorList({ country, language }, page, limit);
};
