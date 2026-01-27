import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDailyProgress, getProgressSummary } from '../../api/endpoints/progress';
import { Button } from '../../components/ui/button';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Weight,
  Flame,
  Calendar,
  Award,
  CheckCircle2
} from 'lucide-react';
import type { DailyProgress, ProgressSummary } from '../../interfaces/progress';

const ProgressHistory: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<DailyProgress[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    fetchProgressData();
  }, [planId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [dailyData, summaryData] = await Promise.all([
        getDailyProgress(Number(planId)),
        getProgressSummary(Number(planId))
      ]);
      setProgressData(dailyData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading progress history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Progress History
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Track your fitness journey and achievements
          </p>
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-6">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Activity className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.totalDays}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Days Tracked</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-6">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <CheckCircle2 className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.completionRate.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-6">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Flame className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {summary.streakDays}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-6">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Weight className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" />
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.weightChange !== null ? Math.abs(summary.weightChange).toFixed(1) : 'N/A'}
                  </span>
                  {summary.weightChange !== null && (
                    summary.weightChange < 0 ? (
                      <TrendingDown className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                    ) : summary.weightChange > 0 ? (
                      <TrendingUp className="text-red-500 w-4 h-4 sm:w-5 sm:h-5" />
                    ) : null
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Weight Change (kg)</p>
            </div>
          </div>
        )}

        {/* Progress Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
            <Calendar size={18} className="sm:hidden" />
            <Calendar size={20} className="hidden sm:block" />
            Daily Progress Log
          </h2>

          {progressData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No progress data yet. Start tracking your workouts and meals!
              </p>
              <Button
                variant="orange"
                onClick={() => navigate(`/member/plans/${planId}/track-progress`)}
              >
                Track Today's Progress
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {progressData.map((progress) => {
                const workoutCompleted = progress.workoutProgress?.filter(wp => wp.status === 'completed').length || 0;
                const workoutTotal = progress.workoutProgress?.length || 0;
                const mealCompleted = progress.mealProgress?.filter(mp => mp.status === 'fully_consumed').length || 0;
                const mealTotal = progress.mealProgress?.length || 0;

                return (
                  <div
                    key={progress.id}
                    className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="text-gray-400" size={16} />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatDate(progress.progress_date)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Day {progress.day_number}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          {/* Workout Progress */}
                          <div className="flex items-center gap-2">
                            <Activity className="text-orange-500" size={16} />
                            <span className="text-gray-600 dark:text-gray-400">
                              Workouts: {workoutCompleted}/{workoutTotal}
                            </span>
                          </div>

                          {/* Meal Progress */}
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" size={16} />
                            <span className="text-gray-600 dark:text-gray-400">
                              Meals: {mealCompleted}/{mealTotal}
                            </span>
                          </div>

                          {/* Weight */}
                          {progress.current_weight && (
                            <div className="flex items-center gap-2">
                              <Weight className="text-purple-500" size={16} />
                              <span className="text-gray-600 dark:text-gray-400">
                                Weight: {progress.current_weight} kg
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Additional Metrics */}
                        {(progress.energy_level || progress.mood || progress.overall_satisfaction) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {progress.energy_level && (
                              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                                Energy: {progress.energy_level.replace('_', ' ')}
                              </span>
                            )}
                            {progress.mood && (
                              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                                Mood: {progress.mood}
                              </span>
                            )}
                            {progress.overall_satisfaction && (
                              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded">
                                Satisfaction: {progress.overall_satisfaction}/10
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Overall Completion Badge */}
                      <div className="flex items-center gap-2">
                        {workoutCompleted === workoutTotal && mealCompleted === mealTotal ? (
                          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
                            <Award size={16} />
                            <span className="text-sm font-medium">Perfect Day!</span>
                          </div>
                        ) : workoutCompleted > 0 || mealCompleted > 0 ? (
                          <div className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full">
                            <span className="text-sm font-medium">Partial Progress</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                            <span className="text-sm font-medium">No Activity</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressHistory;
