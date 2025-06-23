export const FitnessLevelEnum = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export type FitnessLevelEnum =
  (typeof FitnessLevelEnum)[keyof typeof FitnessLevelEnum];

export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export const UserRole = {
  MEMBER: "member",
  MENTOR: "mentor",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
