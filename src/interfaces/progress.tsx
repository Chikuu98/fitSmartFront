export const WorkoutStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
} as const;

export type WorkoutStatus = typeof WorkoutStatus[keyof typeof WorkoutStatus];

export const MealStatus = {
  NOT_CONSUMED: 'not_consumed',
  PARTIALLY_CONSUMED: 'partially_consumed',
  FULLY_CONSUMED: 'fully_consumed',
  SKIPPED: 'skipped',
} as const;

export type MealStatus = typeof MealStatus[keyof typeof MealStatus];

export const EnergyLevel = {
  VERY_LOW: 'very_low',
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
} as const;

export type EnergyLevel = typeof EnergyLevel[keyof typeof EnergyLevel];

export const Mood = {
  VERY_POOR: 'very_poor',
  POOR: 'poor',
  NEUTRAL: 'neutral',
  GOOD: 'good',
  EXCELLENT: 'excellent',
} as const;

export type Mood = typeof Mood[keyof typeof Mood];

export const SleepQuality = {
  VERY_POOR: 'very_poor',
  POOR: 'poor',
  FAIR: 'fair',
  GOOD: 'good',
  EXCELLENT: 'excellent',
} as const;

export type SleepQuality = typeof SleepQuality[keyof typeof SleepQuality];

export const StressLevel = {
  VERY_LOW: 'very_low',
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
} as const;

export type StressLevel = typeof StressLevel[keyof typeof StressLevel];

export interface WorkoutExercise {
  id: number;
  exercise_order: number;
  name: string;
  type: string;
  duration_minutes?: number;
  sets?: number;
  reps?: string;
  weight?: string;
  muscle_groups: string[];
  calories_burned_estimate?: number;
}

export interface WorkoutPlan {
  id: number;
  day_number: number;
  day_name: string;
  total_duration_minutes: number;
  difficulty_level: string;
  notes?: string;
  exercises: WorkoutExercise[];
}

export interface MealItem {
  id: number;
  meal_type: string;
  meal_order: number;
  name: string;
  description?: string;
  ingredients: any[];
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  sugar?: number;
}

export interface MealPlan {
  id: number;
  day_number: number;
  day_name: string;
  total_calories: number;
  total_protein?: number;
  total_carbs?: number;
  total_fats?: number;
  total_fiber?: number;
  notes?: string;
  meals: MealItem[];
}

export interface WorkoutProgress {
  id: number;
  workout_exercise_id: number;
  status: WorkoutStatus;
  actual_weight?: string;
  notes?: string;
  workoutExercise?: WorkoutExercise;
}

export interface MealProgress {
  id: number;
  meal_item_id: number;
  status: MealStatus;
  notes?: string;
  mealItem?: MealItem;
}

export interface DailyProgress {
  id: number;
  progress_date: string;
  day_number: number;
  current_weight?: number;
  energy_level?: EnergyLevel;
  mood?: Mood;
  sleep_hours?: number;
  sleep_quality?: SleepQuality;
  water_intake_liters?: number;
  stress_level?: StressLevel;
  overall_satisfaction?: number;
  workoutProgress?: WorkoutProgress[];
  mealProgress?: MealProgress[];
  created_at: string;
  updated_at: string;
}

export interface TodaysPlanDetails {
  acceptedPlan: {
    id: number;
    plan_name: string;
    status: string;
    start_date?: string;
    end_date?: string;
  };
  canTrackProgress: boolean;
  errorMessage?: string;
  currentDayNumber: number | null;
  progressDate: string;
  workout: WorkoutPlan | null;
  meal: MealPlan | null;
  dailyProgress: DailyProgress | null;
  isFullyTracked?: boolean;
}

export interface CreateDailyProgressDto {
  progress_date: string;
  day_number: number;
  current_weight?: number;
  energy_level?: EnergyLevel;
  mood?: Mood;
  sleep_hours?: number;
  sleep_quality?: SleepQuality;
  water_intake_liters?: number;
  stress_level?: StressLevel;
  overall_satisfaction?: number;
}

export interface BatchWorkoutProgressItem {
  workout_exercise_id: number;
  status: WorkoutStatus;
  actual_weight?: string;
  notes?: string;
}

export interface BatchMealProgressItem {
  meal_item_id: number;
  status: MealStatus;
  notes?: string;
}

export interface DailyMetrics {
  current_weight?: number;
  energy_level?: EnergyLevel;
  mood?: Mood;
  sleep_hours?: number;
  sleep_quality?: SleepQuality;
  water_intake_liters?: number;
  stress_level?: StressLevel;
  overall_satisfaction?: number;
}

export interface BatchProgressDto {
  workouts?: BatchWorkoutProgressItem[];
  meals?: BatchMealProgressItem[];
  dailyMetrics?: DailyMetrics;
}

export interface ProgressSummary {
  totalDays: number;
  completedDays: number;
  completionRate: number;
  streakDays: number;
  lastActivity: string | null;
  averageWeight: number | null;
  weightChange: number | null;
  averageSatisfaction: number | null;
}
