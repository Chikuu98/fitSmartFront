export interface MentorDetails {
  id: number;
  expertise: string;
  bio: string;
  certifications: string;
  social_links: string;
  contact_number: string;
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
  mentorDetails: MentorDetails;
}

export interface MentorListResponse {
  success: boolean;
  data: Mentor[];
}

export interface MentorListFilters {
  country?: string;
  language?: string;
}