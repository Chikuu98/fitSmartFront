import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import CustomSelect from '../../components/ui/customSelect';
import { getUserReports, getReportStats } from '../../api/endpoints/userReports';
import type {
  IUserReport,
  ReportStatus,
  ReportType,
} from '../../interfaces';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/ui/pagination';
import { formatRelativeTime } from '../../utils';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending' as ReportStatus, label: 'Pending' },
  { value: 'under_review' as ReportStatus, label: 'Under Review' },
  { value: 'resolved' as ReportStatus, label: 'Resolved' },
  { value: 'dismissed' as ReportStatus, label: 'Dismissed' },
];

const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'under_review':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'dismissed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getReportTypeLabel = (type: ReportType) => {
  const labels: Record<ReportType, string> = {
    'forum_thread': 'Forum Thread',
    'forum_reply': 'Forum Reply',
    'user_profile': 'User Profile',
    'spam': 'Spam',
    'harassment': 'Harassment',
    'inappropriate_content': 'Inappropriate',
    'fake_account': 'Fake Account',
    'other': 'Other',
  };
  return labels[type] || type;
};

const UserReportsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<IUserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0,
    dismissed: 0,
  });

  const {
    currentPage,
    itemsPerPage,
    pagination,
    setPagination,
    handlePageChange,
  } = usePagination({ initialItemsPerPage: 10 });

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [currentPage, itemsPerPage, statusFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getUserReports(
        currentPage,
        itemsPerPage,
        statusFilter || undefined
      );
      setReports(response.data);
      setPagination({
        total: response.meta.total,
        page: response.meta.page,
        limit: response.meta.limit,
        totalPages: response.meta.totalPages,
        hasNext: response.meta.page < response.meta.totalPages,
        hasPrev: response.meta.page > 1,
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getReportStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleViewReport = (reportId: number) => {
    navigate(`/admin/user-reports/${reportId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Reports Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Review and manage user reports for community content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-400">Under Review</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                {stats.underReview}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-400">Resolved</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                {stats.resolved}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dismissed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.dismissed}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <CustomSelect
              name="statusFilter"
              options={statusOptions}
              value={statusFilter}
              onChange={(option: any) => setStatusFilter(option?.value || '')}
              placeholder="Filter by status"
              isSearchable={false}
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No reports found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {statusFilter
                ? 'No reports match the selected filter'
                : 'There are no user reports at the moment'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Reported User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        #{report.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {report.reporter.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {report.reporter.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {report.reported_user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {report.reported_user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                          {getReportTypeLabel(report.report_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {report.reported_content_type === 'forum_thread'
                          ? 'Thread'
                          : report.reported_content_type === 'forum_reply'
                          ? 'Reply'
                          : 'Profile'}{' '}
                        #{report.reported_content_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(report.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          onClick={() => handleViewReport(report.id)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={() => {}}
                  onPrevPage={() => handlePageChange(currentPage - 1)}
                  onNextPage={() => handlePageChange(currentPage + 1)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserReportsManagement;
