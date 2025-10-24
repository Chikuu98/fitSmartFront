import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { generatePlan } from '../../api/endpoints/plans';
import { getUserProfile } from '../../api/endpoints/users';
import FormInput from '../../components/ui/formInput';
import TextAreaInput from '../../components/ui/textAreaInput';
import { Button } from '../../components/ui/button';
import CustomSelect from '../../components/ui/customSelect';
import { Target, Weight, TrendingDown, Sparkles, User, Activity, Edit2 } from 'lucide-react';
import type { GeneratePlanDto } from '../../interfaces/plan';
import type { User as UserType } from '../../interfaces/user';

const GeneratePlan: React.FC = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [userProfile, setUserProfile] = useState<UserType | null>(null);

    const [formData, setFormData] = useState<GeneratePlanDto>({
        duration_days: 7,
        goal: '',
        target_weight: undefined,
        include_history: true,
        custom_prompt: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch user profile on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoadingProfile(true);
                const profile = await getUserProfile();
                setUserProfile(profile);
                
                // Pre-populate goal if available
                if (profile.memberDetail?.goal) {
                    setFormData(prev => ({ ...prev, goal: profile.memberDetail!.goal! }));
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            } finally {
                setLoadingProfile(false);
            }
        };

        if (user) {
            fetchUserProfile();
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duration_days' || name === 'target_weight' 
                ? (value ? parseFloat(value) : undefined)
                : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name: string) => (option: { value: string; label: string } | null) => {
        setFormData(prev => ({
            ...prev,
            [name]: option ? parseInt(option.value) : 7
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.goal || formData.goal.trim().length < 5) {
            newErrors.goal = 'Please provide a detailed goal (at least 5 characters)';
        }

        if (formData.duration_days && (formData.duration_days < 1 || formData.duration_days > 90)) {
            newErrors.duration_days = 'Duration must be between 1 and 90 days';
        }

        if (formData.target_weight && formData.target_weight < 30) {
            newErrors.target_weight = 'Target weight must be at least 30kg';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            
            // Filter out undefined values
            const payload: GeneratePlanDto = {
                duration_days: formData.duration_days || 7,
                goal: formData.goal,
                include_history: formData.include_history,
            };

            if (formData.target_weight) {
                payload.target_weight = formData.target_weight;
            }

            if (formData.custom_prompt && formData.custom_prompt.trim()) {
                payload.custom_prompt = formData.custom_prompt;
            }

            const generatedPlan = await generatePlan(payload);
            
            // Navigate to plan details or acceptance page
            navigate(`/member/plans/generated/${generatedPlan.id}`);
        } catch (error) {
            console.error('Failed to generate plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const durationOptions = [
        { value: '7', label: '7 days (1 week)' },
        { value: '14', label: '14 days (2 weeks)' },
        { value: '21', label: '21 days (3 weeks)' },
        { value: '28', label: '28 days (4 weeks)' },
    ];

    if (loadingProfile) {
        return (
            <div className="min-h-screen transition-colors flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen transition-colors bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        Generate Your Personalized Plan
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create an AI-powered workout and meal plan tailored to your goals and preferences
                    </p>
                </div>

                {/* User Profile Summary Card */}
                {userProfile?.memberDetail && (
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 mb-6 border border-orange-200 dark:border-orange-700">
                        <div className="flex items-start gap-4">
                            <div className="bg-orange-500 rounded-full p-3">
                                <User className="text-white" size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Profile</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/account')}
                                        className="flex items-center gap-2 text-sm px-3 py-1.5"
                                    >
                                        <Edit2 size={16} />
                                        Update
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Age</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {userProfile.memberDetail.age || 'Not set'} {userProfile.memberDetail.age && 'years'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Weight</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {userProfile.memberDetail.weight || 'Not set'} {userProfile.memberDetail.weight && 'kg'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Height</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {userProfile.memberDetail.height || 'Not set'} {userProfile.memberDetail.height && 'cm'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Fitness Level</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                            {userProfile.memberDetail.fitness_level || 'Not set'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-700">
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Dietary Preference</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {userProfile.memberDetail.dietary_preference || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Plan Duration */}
                        <div>
                            <CustomSelect
                                name="duration_days"
                                value={formData.duration_days?.toString() || '7'}
                                onChange={handleSelectChange('duration_days')}
                                options={durationOptions}
                                label="Plan Duration"
                                placeholder="Select duration"
                                required
                            />
                            {errors.duration_days && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.duration_days}</p>
                            )}
                        </div>

                        {/* Goal */}
                        <div>
                            <TextAreaInput
                                label="Your Goal"
                                name="goal"
                                value={formData.goal}
                                onChange={handleInputChange}
                                placeholder="E.g., Lose 5kg in 7 weeks, Build muscle and strength, Improve overall fitness and endurance"
                                required
                                rows={3}
                                size="sm"
                                error={errors.goal}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Be specific about what you want to achieve for better personalized results
                            </p>
                        </div>

                        {/* Target Weight */}
                        <div>
                            <FormInput
                                label="Target Weight (Optional)"
                                name="target_weight"
                                type="number"
                                value={formData.target_weight?.toString() || ''}
                                onChange={handleInputChange}
                                placeholder="Enter your target weight in kg"
                                icon={<Weight size={18} />}
                                step="0.1"
                                size="md"
                                error={errors.target_weight}
                            />
                        </div>

                        {/* Advanced Options */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Activity size={20} className="text-orange-500" />
                                Advanced Options
                            </h3>

                            {/* Include History */}
                            <div className="flex items-start gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    id="include_history"
                                    name="include_history"
                                    checked={formData.include_history}
                                    onChange={(e) => setFormData(prev => ({ ...prev, include_history: e.target.checked }))}
                                    className="mt-1 h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <div className="flex-1">
                                    <label htmlFor="include_history" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                                        Include Previous Plan Performance
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Use your past workout and meal feedback to create a more personalized plan
                                    </p>
                                </div>
                            </div>

                            {/* Custom Prompt */}
                            <div>
                                <TextAreaInput
                                    label="Additional Instructions (Optional)"
                                    name="custom_prompt"
                                    value={formData.custom_prompt || ''}
                                    onChange={handleInputChange}
                                    placeholder="E.g., Focus more on cardio, Include vegetarian meals only, Avoid exercises that require equipment"
                                    rows={3}
                                    size="sm"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Add any specific preferences or constraints for your plan
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="flex-1"
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="orange"
                                className="flex-1 flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate Plan
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                            <TrendingDown size={18} />
                            AI-Powered Personalization
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Our AI analyzes your profile, goals, and preferences to create a plan that's uniquely tailored to you
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                            <Target size={18} />
                            Complete Workout & Meal Plans
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                            Get detailed daily workouts and balanced meal plans aligned with your fitness goals
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneratePlan;