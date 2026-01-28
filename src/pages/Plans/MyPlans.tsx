import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAcceptedPlans } from '../../api/endpoints/plans';
import { Button } from '../../components/ui/button';
import CustomSelect from '../../components/ui/customSelect';
import Pagination from '../../components/ui/pagination';
import { usePagination } from '../../hooks/usePagination';
import { Calendar, Target, Plus, Eye } from 'lucide-react';
import type { AcceptedPlan } from '../../interfaces/plan';
import { AcceptedPlanStatus } from '../../interfaces/plan';
import { formatRelativeTime } from '../../utils/dateUtils';

const MyPlans: React.FC = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<AcceptedPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const {
        currentPage,
        itemsPerPage,
        pagination,
        setPagination,
        handlePageChange,
        handleItemsPerPageChange,
        handlePrevPage,
        handleNextPage,
        resetToFirstPage,
    } = usePagination({
        initialPage: 1,
        initialItemsPerPage: 10,
    });

    useEffect(() => {
        fetchPlans();
    }, [filterStatus, currentPage, itemsPerPage]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await getAcceptedPlans(filterStatus || undefined, currentPage, itemsPerPage);
            setPlans(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (option: { value: string } | null) => {
        setFilterStatus(option ? option.value : null);
        resetToFirstPage();
    };

    const statusOptions = [
        { value: '', label: 'All Plans' },
        { value: AcceptedPlanStatus.ACCEPTED, label: 'Accepted' },
        { value: AcceptedPlanStatus.ACTIVE, label: 'Active' },
        { value: AcceptedPlanStatus.PAUSED, label: 'Paused' },
        { value: AcceptedPlanStatus.COMPLETED, label: 'Completed' },
        { value: AcceptedPlanStatus.CANCELLED, label: 'Cancelled' },
    ];

    const getStatusColor = (status: AcceptedPlanStatus) => {
        switch (status) {
            case AcceptedPlanStatus.ACCEPTED:
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
            case AcceptedPlanStatus.ACTIVE:
                return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
            case AcceptedPlanStatus.PAUSED:
                return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
            case AcceptedPlanStatus.COMPLETED:
                return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700';
            case AcceptedPlanStatus.CANCELLED:
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
            default:
                return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                                My Fitness Plans
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                Track and manage your workout and meal plans
                            </p>
                        </div>

                        <Button
                            variant="orange"
                            onClick={() => navigate('/member/generate-plan')}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Generate New Plan</span>
                            <span className="sm:hidden">New Plan</span>
                        </Button>
                    </div>

                    {/* Filter */}
                    <div className="max-w-xs">
                        <CustomSelect
                            name="status"
                            value={filterStatus || ''}
                            onChange={handleFilterChange}
                            options={statusOptions}
                            label="Filter by Status"
                            placeholder="All Plans"
                            isClearable
                        />
                    </div>
                </div>

                {/* Plans List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-300">Loading plans...</p>
                        </div>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <Target className="mx-auto mb-4 text-gray-400" size={48} />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No plans found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {filterStatus 
                                    ? 'No plans match the selected filter'
                                    : 'Get started by generating your first personalized plan'}
                            </p>
                            {!filterStatus && (
                                <Button
                                    variant="orange"
                                    onClick={() => navigate('/member/generate-plan')}
                                >
                                    Generate Your First Plan
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:gap-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                                {plan.plan_name}
                                            </h3>
                                            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                                                {plan.status}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5 sm:space-y-2">
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                <Target size={14} className="text-orange-500 flex-shrink-0 sm:w-4 sm:h-4" />
                                                <span className="font-medium">Goal:</span>
                                                <span className="truncate">{plan.target_goal}</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar size={14} className="text-orange-500 flex-shrink-0 sm:w-4 sm:h-4" />
                                                <span className="font-medium">Duration:</span>
                                                <span className="break-words">
                                                    {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
                                                    {plan.duration_days && ` (${plan.duration_days} days)`}
                                                </span>
                                            </div>

                                            {plan.accepted_at && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2">
                                                    Accepted {formatRelativeTime(plan.accepted_at)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/member/plans/accepted/${plan.id}`)}
                                        className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && plans.length > 0 && (
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.total}
                            itemsPerPage={itemsPerPage}
                            hasNext={pagination.hasNext}
                            hasPrev={pagination.hasPrev}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            onPrevPage={handlePrevPage}
                            onNextPage={handleNextPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPlans;
