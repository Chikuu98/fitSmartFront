import type { ForumTag } from './forumTag';
import type { ForumType } from './forumType';
import type { User } from './user';

export interface ForumLike {
  id: number;
  user_id: number;
  thread_id?: number;
  reply_id?: number;
  created_at: string;
  user?: User;
}

export interface ForumReply {
  id: number;
  thread_id: number;
  user_id: number;
  content: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  user?: User;
  parent?: ForumReply;
  children?: ForumReply[];
  likes?: ForumLike[];
  likeCount?: number;
  isLikedByCurrentUser?: boolean;
}

export interface ForumThread {
  id: number;
  user_id: number;
  title: string;
  content: string;
  forum_id?: number;
  created_at: string;
  updated_at: string;
  user?: User;
  forumType?: ForumType;
  replies?: ForumReply[];
  likes?: ForumLike[];
  tags?: ForumTag[];
  replyCount?: number;
  likeCount?: number;
  isLikedByCurrentUser?: boolean;
}

export interface ForumThreadListResponse {
  success: boolean;
  data: {
    data: ForumThread[];
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateForumThreadDto {
  title: string;
  content: string;
  forum_id?: number;
  tag_ids?: number[];
}

export interface UpdateForumThreadDto {
  title?: string;
  content?: string;
  forum_id?: number;
  tag_ids?: number[];
}

export interface CreateForumReplyDto {
  thread_id: number;
  content: string;
  parent_id?: number;
}

export interface UpdateForumReplyDto {
  content: string;
}

export interface ToggleForumLikeDto {
  thread_id?: number;
  reply_id?: number;
}

export interface ForumSearchFilters {
  search?: string;
  forumId?: number;
  tagId?: number;
  userId?: number;
  page?: number;
  limit?: number;
}