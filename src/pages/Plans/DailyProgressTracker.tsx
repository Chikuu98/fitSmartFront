import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTodaysPlanDetails, saveBatchProgress } from '../../api/endpoints/progress';
import { Button } from '../../components/ui/button';
import { 
  ArrowLeft, 
  Dumbbell, 
  UtensilsCrossed, 
  CheckCircle2, 
  Circle, 
  XCircle,
  Loader2,
  Save,
  Activity,
  Heart,
  Moon,
  Droplets,
  Brain,
  Star,
  Weight
} from 'lucide-react';
import { 
  WorkoutStatus, 
  MealStatus,
  EnergyLevel,
  Mood,
  SleepQuality,
  StressLevel
} from '../../interfaces/progress';
import type { 
  TodaysPlanDetails, 
  BatchProgressDto,
  WorkoutExercise,
  MealItem
} from '../../interfaces/progress';

const DailyProgressTracker: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [planDetails, setPlanDetails] = useState<TodaysPlanDetails | null>(null);
  const [workoutStatuses, setWorkoutStatuses] = useState<Record<number, WorkoutStatus>>({});
  const [mealStatuses, setMealStatuses] = useState<Record<number, MealStatus>>({});
  const [workoutNotes, setWorkoutNotes] = useState<Record<number, string>>({});
  const [workoutWeights, setWorkoutWeights] = useState<Record<number, string>>({});
  const [mealNotes, setMealNotes] = useState<Record<number, string>>({});
  
  const [currentWeight, setCurrentWeight] = useState<number | undefined>(undefined);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel | undefined>(undefined);
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [sleepHours, setSleepHours] = useState<number | undefined>(undefined);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | undefined>(undefined);
  const [waterIntake, setWaterIntake] = useState<number | undefined>(undefined);
  const [stressLevel, setStressLevel] = useState<StressLevel | undefined>(undefined);
  const [overallSatisfaction, setOverallSatisfaction] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchTodaysPlan();
  }, [planId]);

  const fetchTodaysPlan = async () => {
    try {
      setLoading(true);
      const data = await getTodaysPlanDetails(Number(planId));
      setPlanDetails(data);

      if (data.dailyProgress) {
        const workoutMap: Record<number, WorkoutStatus> = {};
        const workoutNotesMap: Record<number, string> = {};
        const workoutWeightsMap: Record<number, string> = {};
        data.dailyProgress.workoutProgress?.forEach(wp => {
          workoutMap[wp.workout_exercise_id] = wp.status;
          if (wp.notes) workoutNotesMap[wp.workout_exercise_id] = wp.notes;
          if (wp.actual_weight) workoutWeightsMap[wp.workout_exercise_id] = wp.actual_weight;
        });
        setWorkoutStatuses(workoutMap);
        setWorkoutNotes(workoutNotesMap);
        setWorkoutWeights(workoutWeightsMap);

        const mealMap: Record<number, MealStatus> = {};
        const mealNotesMap: Record<number, string> = {};
        data.dailyProgress.mealProgress?.forEach(mp => {
          mealMap[mp.meal_item_id] = mp.status;
          if (mp.notes) mealNotesMap[mp.meal_item_id] = mp.notes;
        });
        setMealStatuses(mealMap);
        setMealNotes(mealNotesMap);
        
        setCurrentWeight(data.dailyProgress.current_weight);
        setEnergyLevel(data.dailyProgress.energy_level);
        setMood(data.dailyProgress.mood);
        setSleepHours(data.dailyProgress.sleep_hours);
        setSleepQuality(data.dailyProgress.sleep_quality);
        setWaterIntake(data.dailyProgress.water_intake_liters);
        setStressLevel(data.dailyProgress.stress_level);
        setOverallSatisfaction(data.dailyProgress.overall_satisfaction);
      }
    } catch (error) {
      console.error('Failed to fetch today\'s plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutStatusChange = (exerciseId: number, status: WorkoutStatus) => {
    setWorkoutStatuses(prev => ({
      ...prev,
      [exerciseId]: status,
    }));
  };

  const handleMealStatusChange = (mealId: number, status: MealStatus) => {
    setMealStatuses(prev => ({
      ...prev,
      [mealId]: status,
    }));
  };

  const handleSaveProgress = async () => {
    if (!planDetails || !planDetails.canTrackProgress) {
      return;
    }

    try {
      setSaving(true);

      const batchData: BatchProgressDto = {
        workouts: Object.entries(workoutStatuses).map(([id, status]) => ({
          workout_exercise_id: Number(id),
          status,
          actual_weight: workoutWeights[Number(id)] || undefined,
          notes: workoutNotes[Number(id)] || undefined,
        })),
        meals: Object.entries(mealStatuses).map(([id, status]) => ({
          meal_item_id: Number(id),
          status,
          notes: mealNotes[Number(id)] || undefined,
        })),
        dailyMetrics: {
          current_weight: currentWeight,
          energy_level: energyLevel,
          mood: mood,
          sleep_hours: sleepHours,
          sleep_quality: sleepQuality,
          water_intake_liters: waterIntake,
          stress_level: stressLevel,
          overall_satisfaction: overallSatisfaction,
        },
      };

      const progressDateStr = planDetails.progressDate.split('T')[0];

      await saveBatchProgress(
        Number(planId),
        batchData,
        progressDateStr,
        planDetails.currentDayNumber || 1
      );


      await fetchTodaysPlan();
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading today's plan...</p>
        </div>
      </div>
    );
  }

  if (planDetails?.isFullyTracked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Today's Progress Already Tracked
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You have already submitted your progress for today. Come back tomorrow to track your next day!
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Progress Date:</strong> {new Date(planDetails.progressDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/member/plans/accepted/${planId}`)} variant="orange">
              Back to Plan Details
            </Button>
            <Button onClick={() => navigate(`/member/plans/${planId}/progress-history`)} variant="outline">
              View Progress History
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!planDetails || !planDetails.canTrackProgress) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            {planDetails?.acceptedPlan.status === 'paused' ? (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-4">
                <Circle className="text-yellow-600 dark:text-yellow-400" size={32} />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <XCircle className="text-gray-600 dark:text-gray-400" size={32} />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {planDetails?.acceptedPlan.status === 'paused' 
              ? 'Plan is Currently Paused' 
              : 'Progress Tracking Unavailable'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {planDetails?.errorMessage || 'Unable to track progress at this time.'}
          </p>

          {planDetails?.acceptedPlan.status === 'paused' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Progress tracking is disabled while your plan is paused. 
                Resume your plan to continue tracking your daily workouts and meals.
              </p>
            </div>
          )}
          
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/member/plans/accepted/${planId}`)} variant="orange">
              Back to Plan Details
            </Button>
            <Button onClick={() => navigate('/member/my-plans')} variant="outline">
              View All Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!planDetails.workout || !planDetails.meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No plan available for today</p>
          <Button onClick={() => navigate(`/member/plans/accepted/${planId}`)} variant="orange">
            Back to Plan
          </Button>
        </div>
      </div>
    );
  }

  const { workout, meal, currentDayNumber } = planDetails;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/member/plans/accepted/${planId}`)}
            className="mb-3 sm:mb-4 flex items-center text-sm sm:text-base"
          >
            <ArrowLeft size={16} className="mr-1.5 sm:mr-2 sm:hidden" />
            <ArrowLeft size={18} className="mr-2 hidden sm:block" />
            Back to Plan
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Today's Progress Tracker
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Day {currentDayNumber} • {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <Button
              variant="orange"
              onClick={handleSaveProgress}
              disabled={saving}
              className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin sm:hidden" />
                  <Loader2 size={16} className="animate-spin hidden sm:block" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} className="sm:hidden" />
                  <Save size={16} className="hidden sm:block" />
                  Save Progress
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Daily Metrics Section */}
        <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Activity className="text-blue-600 dark:text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Daily Wellness Metrics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Weight */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Weight size={16} />
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={currentWeight || ''}
                onChange={(e) => setCurrentWeight(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 75.5"
              />
            </div>

            {/* Energy Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Activity size={16} />
                Energy Level
              </label>
              <select
                value={energyLevel || ''}
                onChange={(e) => setEnergyLevel(e.target.value as EnergyLevel || undefined)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select...</option>
                <option value="very_low">Very Low</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </div>

            {/* Mood */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Heart size={16} />
                Mood
              </label>
              <select
                value={mood || ''}
                onChange={(e) => setMood(e.target.value as Mood || undefined)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select...</option>
                <option value="very_poor">Very Poor</option>
                <option value="poor">Poor</option>
                <option value="neutral">Neutral</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>

            {/* Sleep Hours */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Moon size={16} />
                Sleep Hours
              </label>
              <input
                type="number"
                step="0.5"
                value={sleepHours || ''}
                onChange={(e) => setSleepHours(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 7.5"
              />
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Moon size={16} />
                Sleep Quality
              </label>
              <select
                value={sleepQuality || ''}
                onChange={(e) => setSleepQuality(e.target.value as SleepQuality || undefined)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select...</option>
                <option value="very_poor">Very Poor</option>
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>

            {/* Water Intake */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Droplets size={16} />
                Water Intake (liters)
              </label>
              <input
                type="number"
                step="0.1"
                value={waterIntake || ''}
                onChange={(e) => setWaterIntake(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 2.5"
              />
            </div>

            {/* Stress Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Brain size={16} />
                Stress Level
              </label>
              <select
                value={stressLevel || ''}
                onChange={(e) => setStressLevel(e.target.value as StressLevel || undefined)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select...</option>
                <option value="very_low">Very Low</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </div>

            {/* Overall Satisfaction */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Star size={16} />
                Overall Satisfaction (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={overallSatisfaction || ''}
                onChange={(e) => setOverallSatisfaction(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="1-10"
              />
            </div>
          </div>
        </div>

        {/* Workout Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Dumbbell className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {workout.day_name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {workout.total_duration_minutes} minutes • {workout.difficulty_level}
              </p>
            </div>
          </div>

          {workout.notes && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              {workout.notes}
            </p>
          )}

          <div className="space-y-3">
            {workout.exercises?.map((exercise: WorkoutExercise) => (
              <div
                key={exercise.id}
                className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {exercise.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                        {exercise.type}
                      </span>
                      {exercise.sets && <span>{exercise.sets} sets</span>}
                      {exercise.reps && <span>{exercise.reps} reps</span>}
                      {exercise.weight && <span>{exercise.weight}</span>}
                      {exercise.duration_minutes && <span>{exercise.duration_minutes} min</span>}
                    </div>
                    {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Target: {exercise.muscle_groups.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleWorkoutStatusChange(exercise.id, WorkoutStatus.COMPLETED)}
                      className={`p-2 rounded-lg transition-colors ${
                        workoutStatuses[exercise.id] === WorkoutStatus.COMPLETED
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Completed"
                    >
                      <CheckCircle2 
                        size={20} 
                        className={workoutStatuses[exercise.id] === WorkoutStatus.COMPLETED ? 'text-green-500' : 'text-gray-400'} 
                      />
                    </button>
                    <button
                      onClick={() => handleWorkoutStatusChange(exercise.id, WorkoutStatus.SKIPPED)}
                      className={`p-2 rounded-lg transition-colors ${
                        workoutStatuses[exercise.id] === WorkoutStatus.SKIPPED
                          ? 'bg-gray-100 dark:bg-gray-700'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Skipped"
                    >
                      <XCircle 
                        size={20} 
                        className={workoutStatuses[exercise.id] === WorkoutStatus.SKIPPED ? 'text-gray-500' : 'text-gray-400'} 
                      />
                    </button>
                  </div>
                </div>
                
                {/* Additional tracking fields */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exercise.type.toLowerCase().includes('strength') && (
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                        Actual Weight Used
                      </label>
                      <input
                        type="text"
                        value={workoutWeights[exercise.id] || ''}
                        onChange={(e) => setWorkoutWeights(prev => ({ ...prev, [exercise.id]: e.target.value }))}
                        placeholder="e.g., 15kg"
                        className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}
                  <div className={exercise.type.toLowerCase().includes('strength') ? '' : 'sm:col-span-2'}>
                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                      Notes
                    </label>
                    <input
                      type="text"
                      value={workoutNotes[exercise.id] || ''}
                      onChange={(e) => setWorkoutNotes(prev => ({ ...prev, [exercise.id]: e.target.value }))}
                      placeholder="How did it feel?"
                      className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meal Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UtensilsCrossed className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {meal.day_name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {meal.total_calories} calories • {meal.total_protein}g protein
              </p>
            </div>
          </div>

          {meal.notes && (
            <p className="text-gray-700 dark:text-gray-300 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              {meal.notes}
            </p>
          )}

          <div className="space-y-3">
            {meal.meals?.map((mealItem: MealItem) => (
              <div
                key={mealItem.id}
                className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                        {mealItem.meal_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {mealItem.name}
                      </h3>
                    </div>
                    {mealItem.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {mealItem.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span>{mealItem.calories} cal</span>
                      {mealItem.protein && <span>{mealItem.protein}g protein</span>}
                      {mealItem.carbs && <span>{mealItem.carbs}g carbs</span>}
                      {mealItem.fats && <span>{mealItem.fats}g fats</span>}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleMealStatusChange(mealItem.id, MealStatus.FULLY_CONSUMED)}
                      className={`p-2 rounded-lg transition-colors ${
                        mealStatuses[mealItem.id] === MealStatus.FULLY_CONSUMED
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Fully Consumed"
                    >
                      <CheckCircle2 
                        size={20} 
                        className={mealStatuses[mealItem.id] === MealStatus.FULLY_CONSUMED ? 'text-green-500' : 'text-gray-400'} 
                      />
                    </button>
                    <button
                      onClick={() => handleMealStatusChange(mealItem.id, MealStatus.PARTIALLY_CONSUMED)}
                      className={`p-2 rounded-lg transition-colors ${
                        mealStatuses[mealItem.id] === MealStatus.PARTIALLY_CONSUMED
                          ? 'bg-yellow-100 dark:bg-yellow-900/20'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Partially Consumed"
                    >
                      <Circle 
                        size={20} 
                        className={mealStatuses[mealItem.id] === MealStatus.PARTIALLY_CONSUMED ? 'text-yellow-500' : 'text-gray-400'} 
                      />
                    </button>
                    <button
                      onClick={() => handleMealStatusChange(mealItem.id, MealStatus.SKIPPED)}
                      className={`p-2 rounded-lg transition-colors ${
                        mealStatuses[mealItem.id] === MealStatus.SKIPPED
                          ? 'bg-gray-100 dark:bg-gray-700'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      title="Skipped"
                    >
                      <XCircle 
                        size={20} 
                        className={mealStatuses[mealItem.id] === MealStatus.SKIPPED ? 'text-gray-500' : 'text-gray-400'} 
                      />
                    </button>
                  </div>
                </div>
                
                {/* Meal notes */}
                <div className="mt-3">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={mealNotes[mealItem.id] || ''}
                    onChange={(e) => setMealNotes(prev => ({ ...prev, [mealItem.id]: e.target.value }))}
                    placeholder="How was the meal?"
                    className="w-full px-2 py-1.5 text-sm border dark:border-gray-600 rounded focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="orange"
            onClick={handleSaveProgress}
            disabled={saving}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving Progress...
              </>
            ) : (
              <>
                <Save size={16} />
                Save All Progress
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyProgressTracker;
