import { Gender, UserRole, FitnessLevelEnum, UserAccountStatus } from "../enums/userDetailEnums";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  gender: Gender;
  country: string;
  language: string;
  status: UserAccountStatus;
  profile_pic?: string;
  created_at: string;
  updated_at: string;
  memberDetail?: MemberDetail;
  mentorDetail?: MentorDetail;
}

export interface MemberDetail {
  id: number;
  age?: number;
  height?: number;
  weight?: number;
  fitness_level?: FitnessLevelEnum;
  goal?: string;
  dietary_preference?: string;
}

export interface MentorDetail {
  id: number;
  expertise: string;
  bio?: string;
  contact_number?: string;
  certification: Certification[];
  socialLink: SocialLink[];
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  issue_date?: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  gender?: Gender;
  country?: string;
  language?: string;
}

export interface UpdateMemberDetailsDto {
  age?: number;
  height?: number;
  weight?: number;
  fitness_level?: FitnessLevelEnum;
  goal?: string;
  dietary_preference?: string;
}

export interface UpdateMentorDetailsDto {
  expertise?: string;
  bio?: string;
  contact_number?: string;
}

export interface CreateCertificationDto {
  title: string;
  issuer: string;
  issue_date?: string;
}

export interface UpdateCertificationDto {
  title?: string;
  issuer?: string;
  issue_date?: string;
}

export interface CreateSocialLinkDto {
  platform: string;
  url: string;
}

export interface UpdateSocialLinkDto {
  platform?: string;
  url?: string;
}

export interface UpdateUserStatusDto {
  status: UserAccountStatus;
  reason?: string;
}
