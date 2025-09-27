import { axiosInstance } from "../axiosInstance";
import type { ForumTag, ForumTagListResponse } from "../../interfaces/forumTag";

export const getForumTags = async (): Promise<ForumTag[]> => {
  try {
    const response = await axiosInstance.get<ForumTagListResponse>("/forum-tags");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching forum tags:", error);
    throw error;
  }
};

export const getForumTagById = async (id: number): Promise<ForumTag> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: ForumTag }>(`/forum-tags/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching forum tag by ID:", error);
    throw error;
  }
};

export const createForumTag = async (forumTag: Omit<ForumTag, "id" | "created_at" | "updated_at">): Promise<ForumTag> => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: ForumTag }>("/forum-tags", forumTag);
    return response.data.data;
  } catch (error) {
    console.error("Error creating forum tag:", error);
    throw error;
  }
};

export const updateForumTag = async (id: number, forumTag: Partial<Omit<ForumTag, "id" | "created_at" | "updated_at">>): Promise<ForumTag> => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: ForumTag }>(`/forum-tags/${id}`, forumTag);
    return response.data.data;
  } catch (error) {
    console.error("Error updating forum tag:", error);
    throw error;
  }
};

export const deleteForumTag = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/forum-tags/${id}`);    
  } catch (error) {
    console.error("Error deleting forum tag:", error);
    throw error;
  }
};