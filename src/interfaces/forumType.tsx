export interface ForumType {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ForumTypeListResponse {
  success: boolean;
  data: ForumType[];
}