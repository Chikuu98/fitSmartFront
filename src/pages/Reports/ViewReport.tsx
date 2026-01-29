import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Activity,
  Utensils,
  Heart,
  Users,
  Weight,
  Award,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '../../components/ui/button';
import { StatCard } from '../../components/ui/StatCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { InsightCard } from '../../components/ui/InsightCard';
import { LineChart, BarChart, DoughnutChart } from '../../components/ui/Charts';
import type { MemberProgressReport } from '../../interfaces/report';

const ViewReport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const report: MemberProgressReport | null = location.state?.report || null;

  useEffect(() => {
    if (!report) {
      navigate('/member/reports/generate');
    }
  }, [report, navigate]);

  if (!report) {
    return null;
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current || isDownloading) return;

    try {
      setIsDownloading(true);

      const element = printRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `progress-report-${new Date(report.startDate).toLocaleDateString()}-to-${new Date(report.endDate).toLocaleDateString()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatEnumValue = (value: string | null) => {
    if (!value) return 'N/A';
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isCustomDateRange = () => {
    const today = new Date();
    const reportStart = new Date(report.startDate);
    const reportEnd = new Date(report.endDate);

    if (report.reportPeriod === 'weekly') {
      const defaultEnd = new Date(today);
      const defaultStart = new Date(today);
      defaultStart.setDate(defaultStart.getDate() - 6);
      return !(reportStart.toDateString() === defaultStart.toDateString() && reportEnd.toDateString() === defaultEnd.toDateString());
    } else if (report.reportPeriod === 'monthly') {
      const defaultEnd = new Date(today);
      const defaultStart = new Date(today);
      defaultStart.setDate(defaultStart.getDate() - 29);
      return !(reportStart.toDateString() === defaultStart.toDateString() && reportEnd.toDateString() === defaultEnd.toDateString());
    }
    return false;
  };

  const weightDataPoints = report.dailyBreakdown.filter((d) => d.weight !== null);
  
  const weightChartData = {
    labels: weightDataPoints.map((d) =>
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightDataPoints.map((d) => d.weight),
        borderColor: 'rgb(255, 103, 35)',
        backgroundColor: 'rgba(255, 103, 35, 0.1)',
        spanGaps: false,
        tension: 0.1,
      },
    ],
  };

  const adherenceChartData = {
    labels: report.dailyBreakdown.map((d) =>
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Workout (%)',
        data: report.dailyBreakdown.map((d) => d.workoutCompletion),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Meal (%)',
        data: report.dailyBreakdown.map((d) => d.mealCompletion),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  const workoutStatusData = {
    labels: ['Completed', 'Skipped', 'Remaining'],
    data: [
      report.workoutStats.completedExercises,
      report.workoutStats.skippedExercises,
      report.workoutStats.totalExercises -
        report.workoutStats.completedExercises -
        report.workoutStats.skippedExercises,
    ],
  };

  const mealStatusData = {
    labels: ['Fully Consumed', 'Partially Consumed', 'Skipped'],
    data: [
      report.mealStats.fullyConsumed,
      report.mealStats.partiallyConsumed,
      report.mealStats.skipped,
    ],
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
          {/* Action Buttons - Hidden on print */}
          <div className="mb-4 sm:mb-6 flex gap-2 sm:gap-4 no-print">
            <Button variant="ghost" onClick={() => navigate('/member/reports/generate')} className='flex items-center justify-center text-sm sm:text-base'>
              <ArrowLeft size={16} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <Button 
              variant="orange" 
              onClick={handleDownloadPDF} 
              disabled={isDownloading}
              className='flex items-center justify-center text-sm sm:text-base'
            >
              <Download size={16} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
              <span className="sm:hidden">{isDownloading ? 'Generating...' : 'Download'}</span>
            </Button>
          </div>

          {/* Printable Content */}
          <div id="print-area" ref={printRef}>
            {/* Report Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-8 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                    {isCustomDateRange() ? 'Progress Report' : (report.reportPeriod === 'weekly' ? 'Weekly' : 'Monthly') + ' Progress Report'}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {formatDate(report.startDate)} - {formatDate(report.endDate)}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Generated</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(report.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Member Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Member Information
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {report.memberInfo.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {report.memberInfo.age || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Height</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {report.memberInfo.height ? `${report.memberInfo.height} cm` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fitness Level</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatEnumValue(report.memberInfo.fitnessLevel)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Info */}
              {report.planInfo.planId && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Active Plan
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Plan Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.planInfo.planName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Target Goal</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.planInfo.targetGoal}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatEnumValue(report.planInfo.status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Completion</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.planInfo.completionPercentage?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* No Data Warning */}
            {report.summary.totalDaysTracked === 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Activity className="text-yellow-500 flex-shrink-0 mt-0.5" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                      No Progress Data Found
                    </h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                      No daily progress has been tracked for the selected period ({formatDate(report.startDate)} - {formatDate(report.endDate)}).
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Start tracking your daily progress to see comprehensive reports with charts and insights!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
              <StatCard
                title="Consistency Score"
                value={`${report.summary.consistencyScore.toFixed(1)}%`}
                subtitle={report.summary.overallProgress}
                icon={Award}
                iconColor="text-orange-500"
                variant={
                  report.summary.consistencyScore >= 80
                    ? 'success'
                    : report.summary.consistencyScore >= 60
                    ? 'default'
                    : 'warning'
                }
              />
              <StatCard
                title="Weight Change"
                value={
                  report.weightProgress.weightChange !== null
                    ? `${report.weightProgress.weightChange > 0 ? '+' : ''}${report.weightProgress.weightChange.toFixed(1)} kg`
                    : '0 kg'
                }
                subtitle={
                  report.weightProgress.currentWeight
                    ? `Current: ${report.weightProgress.currentWeight} kg`
                    : undefined
                }
                icon={Weight}
                iconColor="text-blue-500"
                trend={
                  report.weightProgress.weightChange !== null
                    ? {
                        value: Math.abs(report.weightProgress.weightChange),
                        isPositive: report.weightProgress.weightChange > 0,
                      }
                    : undefined
                }
              />
              <StatCard
                title="Workout Adherence"
                value={`${report.workoutStats.adherenceRate.toFixed(1)}%`}
                subtitle={`${report.workoutStats.completedExercises}/${report.workoutStats.totalExercises} completed`}
                icon={Activity}
                iconColor="text-green-500"
              />
              <StatCard
                title="Meal Adherence"
                value={`${report.mealStats.adherenceRate.toFixed(1)}%`}
                subtitle={`${report.mealStats.fullyConsumed}/${report.mealStats.totalMeals} consumed`}
                icon={Utensils}
                iconColor="text-purple-500"
              />
            </div>

            {/* Weight Progress */}
            {report.weightProgress.startWeight !== null && report.weightProgress.currentWeight !== null && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Weight Progress
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Start Weight
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {report.weightProgress.startWeight} kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Current Weight
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {report.weightProgress.currentWeight} kg
                        </span>
                      </div>
                      {report.weightProgress.targetWeight && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Target Weight
                            </span>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              {report.weightProgress.targetWeight} kg
                            </span>
                          </div>
                          {report.weightProgress.progressToTarget !== null && (
                            <div className="pt-4">
                              <ProgressBar
                                label="Progress to Target"
                                value={report.weightProgress.progressToTarget}
                                color={
                                  report.weightProgress.progressToTarget >= 80
                                    ? 'green'
                                    : report.weightProgress.progressToTarget >= 50
                                    ? 'orange'
                                    : 'blue'
                                }
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {report.dailyBreakdown.some((d) => d.weight !== null) && (
                    <div>
                      <LineChart
                        title="Weight Trend"
                        labels={weightChartData.labels}
                        datasets={weightChartData.datasets}
                        yAxisLabel="Weight (kg)"
                        height={250}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Workout & Meal Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Workout Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Workout Statistics
                </h2>
                <div className="space-y-4 mb-6">
                  <ProgressBar
                    label="Completion Rate"
                    value={report.workoutStats.adherenceRate}
                    color="blue"
                  />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {report.workoutStats.completedExercises}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {report.workoutStats.skippedExercises}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Skipped</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-600">
                        {report.workoutStats.totalExercises}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                    </div>
                  </div>
                </div>
                {report.workoutStats.totalExercises > 0 && (
                  <DoughnutChart
                    title="Exercise Status"
                    labels={workoutStatusData.labels}
                    data={workoutStatusData.data}
                    height={200}
                  />
                )}
                {report.workoutStats.mostFrequentExercises.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Most Frequent Exercises
                    </h3>
                    <div className="space-y-2">
                      {report.workoutStats.mostFrequentExercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {exercise.name}
                          </span>
                          <span className="font-semibold text-orange-500">
                            {exercise.count}x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Meal Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Meal Statistics
                </h2>
                <div className="space-y-4 mb-6">
                  <ProgressBar
                    label="Adherence Rate"
                    value={report.mealStats.adherenceRate}
                    color="green"
                  />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {report.mealStats.fullyConsumed}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Full</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {report.mealStats.partiallyConsumed}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Partial</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {report.mealStats.skipped}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Skipped</p>
                    </div>
                  </div>
                </div>
                {report.mealStats.totalMeals > 0 && (
                  <DoughnutChart
                    title="Meal Status"
                    labels={mealStatusData.labels}
                    data={mealStatusData.data}
                    height={200}
                  />
                )}
              </div>
            </div>

            {/* Adherence Trends */}
            {report.dailyBreakdown.length > 0 && report.summary.totalDaysTracked > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Daily Adherence Trends
                </h2>
                <BarChart
                  title="Workout vs Meal Adherence"
                  labels={adherenceChartData.labels}
                  datasets={adherenceChartData.datasets}
                  yAxisLabel="Completion (%)"
                  height={300}
                />
              </div>
            )}

            {/* Wellness Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Wellness Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="mb-2">
                    <Heart className="text-red-500 mx-auto" size={32} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Energy</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatEnumValue(report.wellnessMetrics.averageEnergyLevel)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <Heart className="text-yellow-500 mx-auto" size={32} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Mood</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatEnumValue(report.wellnessMetrics.averageMood)}
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <Activity className="text-blue-500 mx-auto" size={32} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Sleep</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.wellnessMetrics.averageSleepHours
                      ? `${report.wellnessMetrics.averageSleepHours}h`
                      : 'N/A'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <Activity className="text-cyan-500 mx-auto" size={32} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Water</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.wellnessMetrics.averageWaterIntake
                      ? `${report.wellnessMetrics.averageWaterIntake}L`
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Sleep Quality
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatEnumValue(report.wellnessMetrics.averageSleepQuality)}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Stress Level
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatEnumValue(report.wellnessMetrics.averageStressLevel)}
                  </p>
                </div>
              </div>
              {report.wellnessMetrics.averageSatisfaction !== null && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <ProgressBar
                    label="Average Daily Satisfaction"
                    value={report.wellnessMetrics.averageSatisfaction * 10}
                    showPercentage={false}
                    color="orange"
                  />
                  <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {report.wellnessMetrics.averageSatisfaction.toFixed(1)} / 10
                  </p>
                </div>
              )}
            </div>

            {/* Booking Stats */}
            {report.bookingStats.totalBookings > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Users size={24} />
                  Mentor Sessions
                </h2>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {report.bookingStats.totalBookings}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      {report.bookingStats.completedBookings}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-orange-600">
                      {report.bookingStats.upcomingBookings}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                  </div>
                </div>
                <div className="mt-6">
                  <ProgressBar
                    label="Attendance Rate"
                    value={report.bookingStats.attendanceRate}
                    color="blue"
                  />
                </div>
              </div>
            )}

            {/* Weekly Comparison (Monthly reports only) */}
            {report.weeklyComparison && report.weeklyComparison.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 page-break">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Weekly Comparison
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Week
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date Range
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Avg Weight
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Workout
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Meal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Satisfaction
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {report.weeklyComparison.map((week) => (
                        <tr key={week.weekNumber}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            Week {week.weekNumber}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {new Date(week.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            -{' '}
                            {new Date(week.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {week.averageWeight ? `${week.averageWeight} kg` : <span className="text-gray-400 dark:text-gray-500">-</span>}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                week.workoutAdherence >= 80
                                  ? 'bg-green-100 text-green-800'
                                  : week.workoutAdherence >= 60
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : week.workoutAdherence === 0
                                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {week.workoutAdherence.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                week.mealAdherence >= 80
                                  ? 'bg-green-100 text-green-800'
                                  : week.mealAdherence >= 60
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : week.mealAdherence === 0
                                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {week.mealAdherence.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {week.averageSatisfaction
                              ? `${week.averageSatisfaction}/10`
                              : <span className="text-gray-400 dark:text-gray-500">-</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary & Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Summary & Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Days Tracked</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {report.summary.totalDaysTracked}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                    Consistency
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                    {report.summary.consistencyScore.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Progress</p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                    {report.summary.overallProgress}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InsightCard type="strength" items={report.summary.strengths} />
                <InsightCard
                  type="improvement"
                  items={report.summary.areasForImprovement}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewReport;
