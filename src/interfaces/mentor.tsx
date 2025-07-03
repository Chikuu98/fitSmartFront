export interface MentorDetail {
  id: number;
  expertise: string;
  bio: string;
  contact_number: string;
  certification?: MentorCertification[];
  socialLink?: MentorSocialLink[];
}

export interface MentorCertification {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
}

export interface MentorSocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface Mentor {
  id: number;
  name: string;
  email: string;
  role: string;
  gender: string;
  country: string;
  language: string;
  created_at: string;
  updated_at: string;
  mentorDetail?: MentorDetail;
}

export interface MentorListResponse {
  success: boolean;
  data: Mentor[];
}

export interface MentorListFilters {
  country?: string;
  language?: string;
}
