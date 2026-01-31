import { axiosInstance } from "../axiosInstance";
import type { 
  ForumThread, 
  ForumThreadListResponse,
  CreateForumThreadDto,
  UpdateForumThreadDto,
  ForumSearchFilters
} from "../../interfaces";

export const getForumThreads = async (filters?: ForumSearchFilters): Promise<ForumThreadListResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
    if (filters?.forumId !== undefined) params.append('forumId', filters.forumId.toString());
    if (filters?.tagId !== undefined) params.append('tagId', filters.tagId.toString());
    if (filters?.userId !== undefined) params.append('userId', filters.userId.toString());
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/forum-threads?${queryString}` : '/forum-threads';
    
    const response = await axiosInstance.get<ForumThreadListResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forum threads:", error);
    throw error;
  }
};

export const getForumThreadById = async (id: number): Promise<ForumThread> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: ForumThread }>(`/forum-threads/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching forum thread by ID:", error);
    throw error;
  }
};

export const createForumThread = async (threadData: CreateForumThreadDto): Promise<ForumThread> => {
  try {
    const response = await axiosInstance.post<{ success: boolean; message: string; data: ForumThread }>("/forum-threads", threadData);
    
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    } else {
      console.error("Unexpected response structure:", response.data);
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Error creating forum thread:", error);
    throw error;
  }
};

export const updateForumThread = async (id: number, threadData: UpdateForumThreadDto): Promise<ForumThread> => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: ForumThread }>(`/forum-threads/${id}`, threadData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating forum thread:", error);
    throw error;
  }
};

export const deleteForumThread = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/forum-threads/${id}`);
  } catch (error) {
    console.error("Error deleting forum thread:", error);
    throw error;
  }
};

export const getMyForumThreads = async (page?: number, limit?: number): Promise<ForumThreadListResponse> => {
  try {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/forum-threads/my-threads?${queryString}` : '/forum-threads/my-threads';
    
    const response = await axiosInstance.get<ForumThreadListResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching my forum threads:", error);
    throw error;
  }
};

export const searchForumThreads = async (query: string, page?: number, limit?: number): Promise<ForumThreadListResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('q', query);
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    
    const response = await axiosInstance.get<ForumThreadListResponse>(`/forum-threads/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error searching forum threads:", error);
    throw error;
  }
};