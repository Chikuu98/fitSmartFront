import { axiosInstance } from "../axiosInstance";
import type { 
  ForumReply, 
  CreateForumReplyDto,
  UpdateForumReplyDto
} from "../../interfaces";

export const getForumRepliesByThreadId = async (threadId: number, page?: number, limit?: number): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/forum-replies/thread/${threadId}?${queryString}` : `/forum-replies/thread/${threadId}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching forum replies:", error);
    throw error;
  }
};

export const createForumReply = async (threadId: number, replyData: Omit<CreateForumReplyDto, 'thread_id'>): Promise<ForumReply> => {
  try {
    const requestData: CreateForumReplyDto = {
      ...replyData,
      thread_id: threadId
    };
    const response = await axiosInstance.post<{ success: boolean; data: ForumReply }>(`/forum-replies`, requestData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating forum reply:", error);
    throw error;
  }
};

export const updateForumReply = async (id: number, replyData: UpdateForumReplyDto): Promise<ForumReply> => {
  try {
    const response = await axiosInstance.patch<{ success: boolean; data: ForumReply }>(`/forum-replies/${id}`, replyData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating forum reply:", error);
    throw error;
  }
};

export const deleteForumReply = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/forum-replies/${id}`);
  } catch (error) {
    console.error("Error deleting forum reply:", error);
    throw error;
  }
};