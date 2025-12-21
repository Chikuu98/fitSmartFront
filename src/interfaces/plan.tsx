export const GenerationStatus = {
  GENERATING: 'generating',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type GenerationStatus = typeof GenerationStatus[keyof typeof GenerationStatus];

export const AcceptedPlanStatus = {
  ACCEPTED: 'accepted',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
} as const;

export type AcceptedPlanStatus = typeof AcceptedPlanStatus[keyof typeof AcceptedPlanStatus];

export interface GeneratedPlan {
  id: number;
  plan_type_id: number;
  duration_days: number;
  status: GenerationStatus;
  ai_response?: any;
  prompt_data?: any;
  created_at: string;
  is_accepted: boolean;
}

export interface AcceptedPlan {
  id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  target_goal: string;
  status: AcceptedPlanStatus;
  completion_percentage?: number;
  duration_days?: number;
  accepted_at?: string;
  completed_at?: string;
  paused_at?: string;
  resumed_at?: string;
  total_paused_days?: number;
}

export interface GeneratePlanDto {
  duration_days?: number;
  goal: string;
  target_weight?: number;
  include_history?: boolean;
  custom_prompt?: string;
}

export interface AcceptPlanDto {
  plan_name: string;
  start_date: string;
  target_goal: string;
  initial_weight?: number;
  target_weight?: number;
}

export interface PlanType {
  id: number;
  name: string;
  description: string;
  typical_duration_weeks: number;
  difficulty_level: string;
}
