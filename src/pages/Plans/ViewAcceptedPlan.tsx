import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAcceptedPlan, activatePlan, pausePlan, resumePlan } from '../../api/endpoints/plans';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Calendar, Target, Dumbbell, UtensilsCrossed, TrendingUp, Award, Play, Pause } from 'lucide-react';
import { AcceptedPlanStatus } from '../../interfaces/plan';
import { formatPlanDay } from '../../utils/dateUtils';

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/member/my-plans')}
                        className="mb-4 flex items-center"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back to My Plans
                    </Button>
                    
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {plan.plan_name}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                                    {plan.status}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                View your complete workout and meal plan details
                            </p>
                        </div>

                        {/* Action Buttons based on status */}
                        <div className="flex gap-2">
                            {plan.status === AcceptedPlanStatus.ACCEPTED && (
                                <Button
                                    variant="orange"
                                    onClick={handleActivate}
                                    className="flex items-center gap-2"
                                >
                                    <Play size={16} />
                                    Activate Plan
                                </Button>
                            )}
                            {plan.status === AcceptedPlanStatus.ACTIVE && (
                                <Button
                                    variant="outline"
                                    onClick={handlePause}
                                    className="flex items-center gap-2"
                                >
                                    <Pause size={16} />
                                    Pause Plan
                                </Button>
                            )}
                            {plan.status === AcceptedPlanStatus.PAUSED && (
                                <Button
                                    variant="orange"
                                    onClick={handleResume}
                                    className="flex items-center gap-2"
                                >
                                    <Play size={16} />
                                    Resume Plan
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Plan Info Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="text-orange-500" size={20} />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Goal</h3>
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
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {formatPlanDay(plan.start_date, day.day_number, day.day_name)}
                                    </h3>
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
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {formatPlanDay(plan.start_date, day.day_number, day.day_name)}
                                    </h3>
                                    
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
