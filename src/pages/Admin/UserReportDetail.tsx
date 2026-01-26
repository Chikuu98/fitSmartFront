import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import TextAreaInput from '../../components/ui/textAreaInput';
import CustomSelect from '../../components/ui/customSelect';
import {
  getUserReport,
  reviewUserReport,
  applyPunishment,
} from '../../api/endpoints/userReports';
import type {
  IUserReport,
  ReportStatus,
  PunishmentType,
} from '../../interfaces';
import { formatRelativeTime } from '../../utils';

const statusOptions = [
  { value: 'pending' as ReportStatus, label: 'Pending' },
  { value: 'under_review' as ReportStatus, label: 'Under Review' },
  { value: 'resolved' as ReportStatus, label: 'Resolved' },
  { value: 'dismissed' as ReportStatus, label: 'Dismissed' },
];

const punishmentOptions = [
  { value: 'permanent_ban' as PunishmentType, label: 'Permanent Ban' },
];

const UserReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<IUserReport | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [reviewStatus, setReviewStatus] = useState<ReportStatus | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  
  const [showPunishmentForm, setShowPunishmentForm] = useState(false);
  const [punishmentType, setPunishmentType] = useState<PunishmentType | null>(null);
  const [punishmentReason, setPunishmentReason] = useState('');
  const [punishmentNotes, setPunishmentNotes] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getUserReport(Number(id));
      setReport(response.data);
      setReviewStatus(response.data.status);
      setReviewNotes(response.data.review_notes || '');
    } catch (error) {
      console.error('Error fetching report:', error);
      navigate('/admin/user-reports');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!report || !reviewStatus) return;

    setReviewing(true);
    try {
      await reviewUserReport(report.id, {
        status: reviewStatus,
        review_notes: reviewNotes.trim() || undefined,
      });
      fetchReport();
    } catch (error) {
      console.error('Error reviewing report:', error);
    } finally {
      setReviewing(false);
    }
  };

  const handleApplyPunishment = async () => {
    if (!report || !punishmentType || !punishmentReason.trim()) return;

    setApplying(true);
    try {
      await applyPunishment(report.id, {
        punishment_type: punishmentType,
        reason: punishmentReason.trim(),
        admin_notes: punishmentNotes.trim() || undefined,
      });
      
      setShowPunishmentForm(false);
      fetchReport();
    } catch (error) {
      console.error('Error applying punishment:', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Report not found
        </h3>
        <Button onClick={() => navigate('/admin/user-reports')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 pt-5">
          <Button
            onClick={() => navigate('/admin/user-reports')}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Report #{report.id}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Reported {formatRelativeTime(report.created_at)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <span
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
              report.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : report.status === 'under_review'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : report.status === 'resolved'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {report.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Report Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Type
                </label>
                <p className="mt-1 text-gray-900 dark:text-white capitalize">
                  {report.report_type.replace('_', ' ')}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content Type
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {report.reported_content_type === 'forum_thread'
                    ? `Forum Thread #${report.reported_content_id}`
                    : report.reported_content_type === 'forum_reply'
                    ? `Forum Reply #${report.reported_content_id}`
                    : `User Profile #${report.reported_content_id}`}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reason
                </label>
                <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">
                  {report.reason}
                </p>
              </div>
              
              {report.contentDetails && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reported Content Preview
                  </label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {report.contentDetails.title && (
                      <p className="font-medium text-gray-900 dark:text-white mb-2">
                        {report.contentDetails.title}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {report.contentDetails.content?.substring(0, 200)}
                      {report.contentDetails.content?.length > 200 && '...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Review Report
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <CustomSelect
                  name="reviewStatus"
                  options={statusOptions}
                  value={reviewStatus}
                  onChange={(option: any) => setReviewStatus(option?.value || null)}
                  placeholder="Select status"
                  isSearchable={false}
                />
              </div>

              <TextAreaInput
                label="Review Notes"
                name="reviewNotes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add your review notes..."
                rows={3}
              />

              <div className="flex gap-3">
                <Button
                  onClick={handleReview}
                  disabled={!reviewStatus || reviewing}
                  variant="orange"
                >
                  {reviewing ? 'Saving...' : 'Save Review'}
                </Button>
                
                {report.status !== 'resolved' && (
                  <Button
                    onClick={() => setShowPunishmentForm(true)}
                    variant="red"
                  >
                    Apply Punishment
                  </Button>
                )}
              </div>
            </div>

            {report.reviewed_by && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last reviewed by <span className="font-medium">{report.reviewed_by.name}</span>
                  {' '}on {new Date(report.reviewed_at!).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Punishment Form */}
          {showPunishmentForm && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-red-900 dark:text-red-200 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Apply Punishment
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Punishment Type *
                  </label>
                  <CustomSelect
                    name="punishmentType"
                    options={punishmentOptions}
                    value={punishmentType}
                    onChange={(option: any) => setPunishmentType(option?.value || null)}
                    placeholder="Select punishment type"
                    isSearchable={false}
                  />
                </div>

                <TextAreaInput
                  label="Reason *"
                  name="punishmentReason"
                  value={punishmentReason}
                  onChange={(e) => setPunishmentReason(e.target.value)}
                  placeholder="Reason for this punishment..."
                  rows={2}
                  required
                />

                <TextAreaInput
                  label="Admin Notes (Optional)"
                  name="punishmentNotes"
                  value={punishmentNotes}
                  onChange={(e) => setPunishmentNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={2}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleApplyPunishment}
                    disabled={!punishmentType || !punishmentReason.trim() || applying}
                    variant="red"
                  >
                    {applying ? 'Applying...' : 'Apply Punishment'}
                  </Button>
                  <Button
                    onClick={() => setShowPunishmentForm(false)}
                    disabled={applying}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">
              Reporter
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {report.reporter.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {report.reporter.email}
                </p>
              </div>
            </div>
          </div>

          {/* Reported User Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-4">
              Reported User
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {report.reported_user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {report.reported_user.email}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Account Status:
                <span
                  className={`ml-2 font-medium ${
                    report.reported_user.status === 'active'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {report.reported_user.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReportDetail;
