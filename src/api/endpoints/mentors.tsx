import type { Mentor, MentorListFilters, MentorListResponse } from "../../interfaces/mentor";
import { axiosInstance } from "../axiosInstance";

export const getMentorList = async (filters?: MentorListFilters): Promise<Mentor[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.country) {
      params.append('country', filters.country);
    }
    if (filters?.language) {
      params.append('language', filters.language);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/users/mentors/filter?${queryString}` : '/users/mentors/filter';
    
    const response = await axiosInstance.get<MentorListResponse>(url);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch mentor list');
    }
  } catch (error) {
    console.error('Error fetching mentor list:', error);
    throw error;
  }
};

export const getMentorsByCountry = async (country: string): Promise<Mentor[]> => {
  return getMentorList({ country });
};

export const getMentorsByLanguage = async (language: string): Promise<Mentor[]> => {
  return getMentorList({ language });
};

export const getMentorsByCountryAndLanguage = async (
  country: string, 
  language: string
): Promise<Mentor[]> => {
  return getMentorList({ country, language });
};