export interface ForumTag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ForumTagListResponse {
  success: boolean;
  data: ForumTag[];
}