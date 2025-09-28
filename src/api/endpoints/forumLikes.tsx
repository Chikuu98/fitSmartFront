import { axiosInstance } from "../axiosInstance";
import type { 
  ToggleForumLikeDto,
  ForumLike
} from "../../interfaces";

export const toggleForumLike = async (likeData: ToggleForumLikeDto): Promise<{ success: boolean; data: { liked: boolean; likeCount: number } }> => {
  try {
    const response = await axiosInstance.post<{ success: boolean; data: { liked: boolean; likeCount: number } }>("/forum-likes/toggle", likeData);
    return response.data;
  } catch (error) {
    console.error("Error toggling forum like:", error);
    throw error;
  }
};

export const getForumLikesByThreadId = async (threadId: number): Promise<ForumLike[]> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: ForumLike[] }>(`/forum-likes/thread/${threadId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching forum likes by thread ID:", error);
    throw error;
  }
};

export const getForumLikesByReplyId = async (replyId: number): Promise<ForumLike[]> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: ForumLike[] }>(`/forum-likes/reply/${replyId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching forum likes by reply ID:", error);
    throw error;
  }
};