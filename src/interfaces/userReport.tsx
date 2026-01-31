export type ReportType = 'forum_thread' | 'forum_reply' | 'user_profile' | 'spam' | 'harassment' | 'inappropriate_content' | 'fake_account' | 'other';

export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';

export type ReportedContentType = 'forum_thread' | 'forum_reply' | 'user_profile';

export type PunishmentType = 'warning' | 'temporary_suspension' | 'permanent_ban' | 'forum_restriction' | 'content_removal';

export interface IUserReport {
  id: number;
  reporter: {
    id: number;
    name: string;
    email: string;
  };
  reported_user: {
    id: number;
    name: string;
    email: string;
    status: string;
  };
  report_type: ReportType;
  reported_content_type: ReportedContentType;
  reported_content_id: number;
  reason: string;
  evidence?: string;
  status: ReportStatus;
  reviewed_by?: {
    id: number;
    name: string;
  };
  review_notes?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  contentDetails?: any;
}

export interface IUserPunishment {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  punishment_type: PunishmentType;
  reason: string;
  admin_notes?: string;
  issued_by: {
    id: number;
    name: string;
  };
  related_report_id?: number;
  expires_at?: string;
  is_active: boolean;
  ended_at?: string;
  lifted_by?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateUserReportPayload {
  report_type: ReportType;
  reported_content_type: ReportedContentType;
  reported_content_id: number;
  reason: string;
  evidence?: string;
}

export interface ReviewUserReportPayload {
  status: ReportStatus;
  review_notes?: string;
}

export interface ApplyPunishmentPayload {
  punishment_type: PunishmentType;
  reason: string;
  admin_notes?: string;
  expires_at?: string;
}
