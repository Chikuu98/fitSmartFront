import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import FormInput from '../../components/ui/formInput';
import CustomSelect from '../../components/ui/customSelect';
import { generateMemberReport } from '../../api/endpoints/reports';
import type { GenerateReportRequest } from '../../interfaces/report';

const GenerateReport: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState<string>('');
  const [formData, setFormData] = useState<GenerateReportRequest>({
    period: 'weekly',
    startDate: '',
    endDate: '',
    acceptedPlanId: undefined,
  });

  const periodOptions = [
    { value: 'weekly', label: 'Weekly Report (Last 7 Days)' },
    { value: 'monthly', label: 'Monthly Report (Last 30 Days)' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateError('');
    
    if (formData.startDate || formData.endDate) {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if (formData.startDate) {
        const startDate = new Date(formData.startDate);
        if (startDate > todayDate) {
          setDateError('Start date cannot be in the future');
          return;
        }
      }

      if (formData.endDate) {
        const endDate = new Date(formData.endDate);
        if (endDate > todayDate) {
          setDateError('End date cannot be in the future');
          return;
        }
      }

      if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        if (startDate > endDate) {
          setDateError('Start date must be before or equal to end date');
          return;
        }
      }
    }
    
    try {
      setLoading(true);
      
      const payload: GenerateReportRequest = {
        period: formData.period,
      };
      
      if (formData.startDate && formData.endDate) {
        payload.startDate = formData.startDate;
        payload.endDate = formData.endDate;
      }
      
      if (formData.acceptedPlanId) {
        payload.acceptedPlanId = formData.acceptedPlanId;
      }
      
      const report = await generateMemberReport(payload);
      
      navigate('/member/reports/view', { state: { report } });
    } catch (error: any) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (selectedOption: any) => {
    setFormData({
      ...formData,
      period: selectedOption.value,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <FileText className="text-orange-500 w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Generate Progress Report
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create a comprehensive report of your fitness journey, including workouts, meals,
            wellness metrics, and progress tracking.
          </p>
        </div>

        {/* Report Options */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Period Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Report Period <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={periodOptions}
                value={periodOptions.find((opt) => opt.value === formData.period)?.value || null}
                onChange={handlePeriodChange}
                placeholder="Select report period"
                isClearable={false}
                name="period"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choose the time period for your report. Default ranges are used unless custom dates are specified.
              </p>
            </div>

            {/* Custom Date Range */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Custom Date Range (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD"
                  max={today}
                />
                <FormInput
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD"
                  max={today}
                />
              </div>
              {dateError && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                  <span>⚠️</span> {dateError}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Leave empty to use default date ranges based on the selected period. Future dates are not allowed.
              </p>
            </div>

            {/* Plan Filter */}
            {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Filter by Plan (Optional)
              </h3>
              <FormInput
                label="Accepted Plan ID"
                name="acceptedPlanId"
                type="number"
                value={formData.acceptedPlanId?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    acceptedPlanId: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="Enter plan ID"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to include data from your most recent active plan.
              </p>
            </div> */}

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                variant="orange"
                disabled={loading}
                className="flex-1 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText size={18} className="mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/member-dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1 sm:mb-2">
              Weekly Reports
            </h3>
            <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
              Get a snapshot of your last 7 days including daily progress, workout adherence,
              meal tracking, and wellness metrics.
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-purple-900 dark:text-purple-100 mb-1 sm:mb-2">
              Monthly Reports
            </h3>
            <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-200">
              Review your entire month with weekly comparisons, weight trends, consistency scores,
              and comprehensive insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
