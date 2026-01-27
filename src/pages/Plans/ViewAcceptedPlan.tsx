import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAcceptedPlan, activatePlan, pausePlan, resumePlan } from '../../api/endpoints/plans';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Calendar, Target, Dumbbell, UtensilsCrossed, TrendingUp, Award, Play, Pause, Clock, CheckSquare, BarChart3 } from 'lucide-react';
import { AcceptedPlanStatus } from '../../interfaces/plan';
import { formatPlanDay, formatDateTime, calculateCurrentDayNumber } from '../../utils/dateUtils';

const ViewAcceptedPlan: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlan();
    }, [planId]);

    const fetchPlan = async () => {
        try {
            setLoading(true);
            const data = await getAcceptedPlan(Number(planId));
            setPlan(data);
        } catch (error) {
            console.error('Failed to fetch plan:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading plan details...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Plan not found</p>
                    <Button onClick={() => navigate('/member/my-plans')} variant="orange">
                        Back to My Plans
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            case 'active':
                return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
            case 'paused':
                return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
            case 'completed':
                return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700';
            case 'cancelled':
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
            default:
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    const handleActivate = async () => {
        try {
            await activatePlan(Number(planId));
            fetchPlan();
        } catch (error: any) {
            console.log(error);
        }
    };

    const handlePause = async () => {
        try {
            await pausePlan(Number(planId));
            fetchPlan();
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleResume = async () => {
        try {
            await resumePlan(Number(planId));
            fetchPlan();
        } catch (error: any) {
            console.log(error);
        }
    };

    const isDayShifted = (dayNumber: number): boolean => {
        if (!plan.total_paused_days || plan.total_paused_days === 0) return false;
        const currentDay = calculateCurrentDayNumber(
            plan.start_date, 
            plan.total_paused_days, 
            plan.status === AcceptedPlanStatus.PAUSED ? plan.paused_at : null
        );
        return dayNumber > currentDay;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/member/my-plans')}
                        className="mb-3 sm:mb-4 flex items-center text-sm sm:text-base"
                    >
                        <ArrowLeft size={16} className="mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Back to My Plans</span>
                        <span className="sm:hidden">Back</span>
                    </Button>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    {plan.plan_name}
                                </h1>
                                <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                                    {plan.status}
                                </span>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                View your complete workout and meal plan details
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {plan.status === AcceptedPlanStatus.ACCEPTED && (
                                <Button
                                    variant="orange"
                                    onClick={handleActivate}
                                    className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center text-sm"
                                >
                                    <Play size={14} />
                                    <span className="hidden sm:inline">Activate Plan</span>
                                    <span className="sm:hidden">Activate</span>
                                </Button>
                            )}
                            {plan.status === AcceptedPlanStatus.ACTIVE && (
                                <>
                                    <Button
                                        variant="orange"
                                        onClick={() => navigate(`/member/plans/${planId}/track-progress`)}
                                        className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center text-sm"
                                    >
                                        <CheckSquare size={14} />
                                        <span className="hidden sm:inline">Track Today's Progress</span>
                                        <span className="sm:hidden">Track</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handlePause}
                                        className="flex items-center gap-1 sm:gap-2 justify-center text-sm"
                                    >
                                        <Pause size={14} />
                                        Pause
                                    </Button>
                                </>
                            )}
                            {plan.status === AcceptedPlanStatus.PAUSED && (
                                <Button
                                    variant="orange"
                                    onClick={handleResume}
                                    className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center text-sm"
                                >
                                    <Play size={14} />
                                    <span className="hidden sm:inline">Resume Plan</span>
                                    <span className="sm:hidden">Resume</span>
                                </Button>
                            )}
                            {(plan.status === AcceptedPlanStatus.ACTIVE || plan.status === AcceptedPlanStatus.COMPLETED) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate(`/member/plans/${planId}/progress-history`)}
                                    className="flex items-center gap-1 sm:gap-2 justify-center text-sm"
                                >
                                    <BarChart3 size={14} />
                                    <span className="hidden sm:inline">View History</span>
                                    <span className="sm:hidden">History</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Plan Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-md">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                            <Target className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5" />
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Goal</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{plan.target_goal}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="text-orange-500" size={20} />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Duration</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {plan.progress_summary?.totalDays || 0} days
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-orange-500" size={20} />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Progress</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all"
                                    style={{ width: `${plan.progress_summary?.completionRate || 0}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {Math.round(plan.progress_summary?.completionRate || 0)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Weight Info */}
                {(plan.initial_weight || plan.target_weight) && (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 mb-6 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Award className="text-purple-600 dark:text-purple-400" size={20} />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Weight Tracking:</span>
                            </div>
                            {plan.initial_weight && (
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="text-gray-500 dark:text-gray-400">Initial:</span> {plan.initial_weight} kg
                                </div>
                            )}
                            {plan.target_weight && (
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="text-gray-500 dark:text-gray-400">Target:</span> {plan.target_weight} kg
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pause Info */}
                {plan.total_paused_days > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 mb-6 border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-start gap-3">
                            <Clock className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={20} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Plan Pause Information</span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                    <p>
                                        <span className="text-gray-500 dark:text-gray-400">Total paused days:</span>{' '}
                                        <span className="font-semibold">{plan.total_paused_days} day{plan.total_paused_days !== 1 ? 's' : ''}</span>
                                    </p>
                                    {plan.paused_at && plan.status === AcceptedPlanStatus.PAUSED && (
                                        <p>
                                            <span className="text-gray-500 dark:text-gray-400">Paused since:</span>{' '}
                                            {formatDateTime(plan.paused_at)}
                                        </p>
                                    )}
                                    {plan.resumed_at && (
                                        <p>
                                            <span className="text-gray-500 dark:text-gray-400">Last resumed:</span>{' '}
                                            {formatDateTime(plan.resumed_at)}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                                        Your plan end date has been automatically extended by {plan.total_paused_days} day{plan.total_paused_days !== 1 ? 's' : ''} to account for the pause period.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Plans Content */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Workout Plan */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Dumbbell className="text-orange-500" size={24} />
                            Workout Plan
                        </h2>
                        
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {plan.workoutPlan?.map((day: any, index: number) => (
                                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
                                            {formatPlanDay(
                                                plan.start_date, 
                                                day.day_number, 
                                                day.day_name,
                                                plan.total_paused_days,
                                                plan.paused_at,
                                                plan.status
                                            )}
                                        </h3>
                                        {isDayShifted(day.day_number) && plan.total_paused_days > 0 && (
                                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full flex items-center gap-1" title={`Date adjusted by ${plan.total_paused_days} day(s) due to pause`}>
                                                <Clock size={12} />
                                                Adjusted
                                            </span>
                                        )}
                                    </div>
                                    {day.exercises && day.exercises.length > 0 ? (
                                        <>
                                            <ul className="space-y-2 mb-2">
                                                {day.exercises.map((exercise: any, eIndex: number) => (
                                                    <li key={eIndex} className="text-sm text-gray-700 dark:text-gray-300">
                                                        <span className="font-medium">{exercise.name}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                            ({exercise.type})
                                                        </span>
                                                        {exercise.sets && exercise.reps && (
                                                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                                {exercise.sets} × {exercise.reps}
                                                            </span>
                                                        )}
                                                        {exercise.duration_minutes && (
                                                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                                {exercise.duration_minutes} min
                                                            </span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                            {day.total_duration_minutes && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                                    Total: {day.total_duration_minutes} minutes
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Rest day</p>
                                    )}
                                    {day.notes && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                                            {day.notes}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Meal Plan */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <UtensilsCrossed className="text-orange-500" size={24} />
                            Meal Plan
                        </h2>
                        
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {plan.mealPlan?.map((day: any, index: number) => (
                                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
                                            {formatPlanDay(
                                                plan.start_date, 
                                                day.day_number, 
                                                day.day_name,
                                                plan.total_paused_days,
                                                plan.paused_at,
                                                plan.status
                                            )}
                                        </h3>
                                        {isDayShifted(day.day_number) && plan.total_paused_days > 0 && (
                                            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full flex items-center gap-1" title={`Date adjusted by ${plan.total_paused_days} day(s) due to pause`}>
                                                <Clock size={12} />
                                                Adjusted
                                            </span>
                                        )}
                                    </div>
                                    
                                    {day.meals && day.meals.length > 0 && (
                                        <div className="space-y-3">
                                            {day.meals.map((meal: any, mIndex: number) => (
                                                <div key={mIndex}>
                                                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase mb-1">
                                                        {meal.meal_type}
                                                    </h4>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        {meal.name}
                                                    </p>
                                                    {meal.calories && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {meal.calories} kcal
                                                            {meal.protein && ` • ${meal.protein}g protein`}
                                                            {meal.carbs && ` • ${meal.carbs}g carbs`}
                                                            {meal.fats && ` • ${meal.fats}g fat`}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {day.total_calories && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                            Total: {day.total_calories} kcal
                                            {day.total_protein && ` • ${day.total_protein}g protein`}
                                            {day.total_carbs && ` • ${day.total_carbs}g carbs`}
                                            {day.total_fats && ` • ${day.total_fats}g fat`}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAcceptedPlan;
