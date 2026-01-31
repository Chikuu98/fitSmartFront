import { axiosInstance } from "../axiosInstance";
import type { ForumType, ForumTypeListResponse } from "../../interfaces/forumType";

export const getForumTypes = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axiosInstance.get(`/forum-types?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching forum types:", error);
    throw error;
  }
};

export const getForumTypeById = async (id: number): Promise<ForumType> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: ForumType }>(`/forum-types/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching forum type by ID:", error);
    throw error;
  }
};

export const createForumType = async (forumType: Omit<ForumType, "id" | "created_at" | "updated_at">): Promise<ForumType> => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: ForumType }>("/forum-types", forumType);
    return response.data.data;
  } catch (error) {
    console.error("Error creating forum type:", error);
    throw error;
  }
};

export const updateForumType = async (id: number, forumType: Partial<Omit<ForumType, "id" | "created_at" | "updated_at">>): Promise<ForumType> => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: ForumType }>(`/forum-types/${id}`, forumType);
    return response.data.data;
  } catch (error) {
    console.error("Error updating forum type:", error);
    throw error;
  }
};

export const deleteForumType = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/forum-types/${id}`);
  } catch (error) {
    console.error("Error deleting forum type:", error);
    throw error;
  }
};