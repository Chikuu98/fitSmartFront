import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGeneratedPlan, acceptPlan, generatePlan } from '../../api/endpoints/plans';
import { Button } from '../../components/ui/button';
import FormInput from '../../components/ui/formInput';
import { DateInput } from '../../components/ui/dateInput';
import Modal from '../../components/ui/Modal';
import { ConfirmationDialog } from '../../components/ui/confirmationDialog';
import { CheckCircle, Target, Dumbbell, UtensilsCrossed, ArrowLeft, RefreshCw } from 'lucide-react';
import type { GeneratedPlan, AcceptPlanDto } from '../../interfaces/plan';
import { GenerationStatus } from '../../interfaces/plan';

const ViewGeneratedPlan: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [plan, setPlan] = useState<GeneratedPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [accepting, setAccepting] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);

    const [acceptFormData, setAcceptFormData] = useState<AcceptPlanDto>({
        plan_name: '',
        start_date: new Date().toISOString().split('T')[0],
        target_goal: '',
        initial_weight: undefined,
        target_weight: undefined,
    });

    useEffect(() => {
        fetchPlan();
    }, [planId]);

    const fetchPlan = async () => {
        try {
            setLoading(true);
            const data = await getGeneratedPlan(Number(planId));
            setPlan(data);
            
            if (data.ai_response) {
                setAcceptFormData(prev => ({
                    ...prev,
                    plan_name: `My ${data.duration_days}-Day Plan`,
                    target_goal: data.prompt_data?.goal || '',
                    target_weight: data.prompt_data?.target_weight,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptPlan = async () => {
        try {
            setAccepting(true);
            await acceptPlan(Number(planId), acceptFormData);
            navigate('/member/my-plans');
        } catch (error) {
            console.error('Failed to accept plan:', error);
        } finally {
            setAccepting(false);
        }
    };

    const handleRegeneratePlan = async () => {
        try {
            setRegenerating(true);
            
            const generateParams = {
                duration_days: plan?.duration_days || 7,
                goal: plan?.prompt_data?.goal || 'Improve overall fitness',
                target_weight: plan?.prompt_data?.target_weight,
                include_history: true,
            };
            
            const newPlan = await generatePlan(generateParams);
            setShowRegenerateDialog(false);
            
            navigate(`/member/plans/generated/${newPlan.id}`);
        } catch (error) {
            console.error('Failed to regenerate plan:', error);
        } finally {
            setRegenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading your plan...</p>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Plan not found</p>
                    <Button onClick={() => navigate(-1)} variant="orange">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const workoutPlan = plan.ai_response?.workout_plan || [];
    const mealPlan = plan.ai_response?.meal_plan || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-4 flex items-center"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                    </Button>
                    
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                Your Generated Plan
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {plan.duration_days}-day personalized workout and meal plan
                            </p>
                        </div>

                        {!plan.is_accepted && plan.status === GenerationStatus.COMPLETED && (
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRegenerateDialog(true)}
                                    disabled={regenerating}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw size={18} className={regenerating ? 'animate-spin' : ''} />
                                    {regenerating ? 'Regenerating...' : 'Re-generate'}
                                </Button>
                                <Button
                                    variant="orange"
                                    onClick={() => setShowAcceptModal(true)}
                                    className="flex items-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                    Accept Plan
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Banner */}
                {plan.status === GenerationStatus.GENERATING && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                        <p className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            Plan is being generated...
                        </p>
                    </div>
                )}

                {plan.status === GenerationStatus.FAILED && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
                        <p className="text-red-700 dark:text-red-300">
                            Plan generation failed. Please try again.
                        </p>
                    </div>
                )}

                {plan.is_accepted && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
                        <p className="text-green-700 dark:text-green-300 flex items-center gap-2">
                            <CheckCircle size={18} />
                            This plan has been accepted and is active
                        </p>
                    </div>
                )}

                {/* Plan Content */}
                {plan.status === GenerationStatus.COMPLETED && (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Workout Plan */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Dumbbell className="text-orange-500" size={24} />
                                Workout Plan
                            </h2>
                            
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {workoutPlan.map((day: any, index: number) => (
                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Day {index + 1}: {day.day || `Day ${index + 1}`}
                                        </h3>
                                        {day.workouts && day.workouts.length > 0 ? (
                                            <ul className="space-y-2">
                                                {day.workouts.map((workout: any, wIndex: number) => (
                                                    <li key={wIndex} className="text-sm text-gray-700 dark:text-gray-300">
                                                        <span className="font-medium">{workout.name}</span>
                                                        {workout.sets && workout.reps && (
                                                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                                {workout.sets} sets × {workout.reps} reps
                                                            </span>
                                                        )}
                                                        {workout.duration_minutes && (
                                                            <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                                {workout.duration_minutes} min
                                                            </span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
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
                                {mealPlan.map((day: any, index: number) => (
                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            Day {index + 1}: {day.day || `Day ${index + 1}`}
                                        </h3>
                                        
                                        {day.meals && (
                                            <div className="space-y-3">
                                                {Object.entries(day.meals).map(([mealType, mealData]: [string, any]) => (
                                                    <div key={mealType}>
                                                        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase mb-1">
                                                            {mealType}
                                                        </h4>
                                                        {Array.isArray(mealData) ? (
                                                            <ul className="space-y-1">
                                                                {mealData.map((meal: any, mIndex: number) => (
                                                                    <li key={mIndex} className="text-sm text-gray-700 dark:text-gray-300">
                                                                        {meal.name}
                                                                        {meal.calories && (
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                                                ({meal.calories} kcal)
                                                                            </span>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                {mealData.name}
                                                                {mealData.calories && (
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                                        ({mealData.calories} kcal)
                                                                    </span>
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Accept Plan Modal */}
            <Modal
                isOpen={showAcceptModal}
                onClose={() => setShowAcceptModal(false)}
                title="Accept Plan"
            >
                <div className="space-y-4">
                    <FormInput
                        label="Plan Name"
                        name="plan_name"
                        value={acceptFormData.plan_name}
                        onChange={(e) => setAcceptFormData(prev => ({ ...prev, plan_name: e.target.value }))}
                        placeholder="My Summer Fitness Plan"
                        required
                        icon={<Target size={18} />}
                    />

                    <DateInput
                        label="Start Date"
                        name="start_date"
                        value={acceptFormData.start_date}
                        onChange={(e) => setAcceptFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        required
                    />

                    <FormInput
                        label="Target Goal"
                        name="target_goal"
                        value={acceptFormData.target_goal}
                        onChange={(e) => setAcceptFormData(prev => ({ ...prev, target_goal: e.target.value }))}
                        placeholder="Lose 5kg, build strength"
                        required
                        icon={<Target size={18} />}
                    />

                    <FormInput
                        label="Current Weight (Optional)"
                        name="initial_weight"
                        type="number"
                        value={acceptFormData.initial_weight?.toString() || ''}
                        onChange={(e) => setAcceptFormData(prev => ({ 
                            ...prev, 
                            initial_weight: e.target.value ? parseFloat(e.target.value) : undefined 
                        }))}
                        placeholder="70"
                        step="0.1"
                    />

                    <FormInput
                        label="Target Weight (Optional)"
                        name="target_weight"
                        type="number"
                        value={acceptFormData.target_weight?.toString() || ''}
                        onChange={(e) => setAcceptFormData(prev => ({ 
                            ...prev, 
                            target_weight: e.target.value ? parseFloat(e.target.value) : undefined 
                        }))}
                        placeholder="65"
                        step="0.1"
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowAcceptModal(false)}
                            className="flex-1"
                            disabled={accepting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="orange"
                            onClick={handleAcceptPlan}
                            className="flex-1"
                            disabled={accepting}
                        >
                            {accepting ? 'Accepting...' : 'Accept Plan'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmationDialog
                isOpen={showRegenerateDialog}
                onClose={() => setShowRegenerateDialog(false)}
                onConfirm={handleRegeneratePlan}
                title="Regenerate Plan?"
                message="A new plan will be created with the same parameters. You will be redirected to view the newly generated plan."
                confirmText="Regenerate"
                cancelText="Cancel"
                variant="info"
                loading={regenerating}
            />
        </div>
    );
};

export default ViewGeneratedPlan;
