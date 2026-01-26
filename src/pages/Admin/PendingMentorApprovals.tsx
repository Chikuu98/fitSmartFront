import React, { useState, useEffect } from "react";
import {
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  MapPin,
  Globe,
  Phone,
  Briefcase,
  FileText,
} from "lucide-react";
import { DataTable, type Column } from "../../components/ui/dataTable";
import { useConfirmationDialog } from "../../components/ui/confirmationDialog";
import Pagination from "../../components/ui/pagination";
import { usePagination } from "../../hooks/usePagination";
import { Button } from "../../components/ui/button";
import type { User } from "../../interfaces/user";
import { UserAccountStatus } from "../../enums/userDetailEnums";
import {
  getPendingMentors,
  updateUserStatus,
} from "../../api/endpoints/users";
import { formatRelativeTime } from "../../utils/dateUtils";

const PendingMentorApprovals: React.FC = () => {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const { openDialog, ConfirmDialog } = useConfirmationDialog();

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
    fetchPendingMentors();
  }, [currentPage, itemsPerPage]);

  const fetchPendingMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPendingMentors();
      if (response.success) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = response.data.slice(startIndex, endIndex);
        
        setMentors(paginatedData);
        setPagination({
          page: currentPage,
          limit: itemsPerPage,
          total: response.data.length,
          totalPages: Math.ceil(response.data.length / itemsPerPage),
          hasNext: currentPage < Math.ceil(response.data.length / itemsPerPage),
          hasPrev: currentPage > 1,
        });
      }
    } catch (err: any) {
      console.error("Error fetching pending mentors:", err);
      setError(err.response?.data?.message || "Failed to load pending mentors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (mentor: User) => {
    openDialog({
      title: "Approve Mentor",
      message: `Are you sure you want to approve "${mentor.name}"? They will be able to login and access the system.`,
      confirmText: "Approve",
      cancelText: "Cancel",
      variant: "info",
      onConfirm: async (close) => {
        close();
        await approveMentor(mentor.id);
      },
    });
  };

  const approveMentor = async (mentorId: number) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(mentorId));
      const response = await updateUserStatus(mentorId, {
        status: UserAccountStatus.ACTIVE,
      });

      if (response.success) {
        if (mentors.length === 1 && currentPage > 1) {
          resetToFirstPage();
        } else {
          fetchPendingMentors();
        }
      }
    } catch (error: any) {
      console.error("Error approving mentor:", error);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mentorId);
        return newSet;
      });
    }
  };

  const handleReject = (mentor: User) => {
    openDialog({
      title: "Reject Mentor",
      message: `Are you sure you want to reject "${mentor.name}"? They will not be able to login to the system.`,
      confirmText: "Reject",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async (close) => {
        close();
        await rejectMentor(mentor.id);
      },
    });
  };

  const rejectMentor = async (mentorId: number) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(mentorId));
      const response = await updateUserStatus(mentorId, {
        status: UserAccountStatus.SUSPENDED,
      });

      if (response.success) {
        if (mentors.length === 1 && currentPage > 1) {
          resetToFirstPage();
        } else {
          fetchPendingMentors();
        }
      }
    } catch (error: any) {
      console.error("Error rejecting mentor:", error);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(mentorId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-800 dark:text-yellow-200",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending Review",
      },
      active: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-800 dark:text-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Active",
      },
      suspended: {
        bg: "bg-red-100 dark:bg-red-900",
        text: "text-red-800 dark:text-red-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "Suspended",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.pending_review;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Mentor Name",
      width: "25%",
      render: (_value, mentor) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white truncate">
              {mentor.name}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{mentor.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Expertise & Details",
      width: "28%",
      render: (_value, mentor) => (
        <div className="space-y-1.5 py-1">
          {mentor.mentorDetail && (
            <>
              <div className="flex items-center gap-1.5 text-sm text-gray-900 dark:text-white">
                <Briefcase className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                <span className="font-medium truncate">
                  {mentor.mentorDetail.expertise}
                </span>
              </div>
              {mentor.mentorDetail.bio && (
                <div className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <FileText className="w-3.5 h-3.5 mt-0.5 text-gray-500 flex-shrink-0" />
                  <span className="line-clamp-2 leading-relaxed">{mentor.mentorDetail.bio}</span>
                </div>
              )}
              {mentor.mentorDetail.contact_number && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{mentor.mentorDetail.contact_number}</span>
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      key: "country",
      header: "Location & Language",
      width: "18%",
      render: (_value, mentor) => (
        <div className="space-y-1.5 py-1">
          <div className="flex items-center gap-1.5 text-sm text-gray-900 dark:text-white">
            <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="truncate">{mentor.country}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Globe className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="truncate">{mentor.language}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "15%",
      render: (_value, mentor) => (
        <div className="space-y-1.5 py-1">
          {getStatusBadge(mentor.status)}
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {formatRelativeTime(mentor.created_at)}
          </div>
        </div>
      ),
    },
    {
      key: "id",
      header: "Actions",
      width: "14%",
      render: (_value, mentor) => (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="orange"
            onClick={() => handleApprove(mentor)}
            disabled={processingIds.has(mentor.id)}
            className="text-xs px-3 py-1.5 whitespace-nowrap justify-center flex items-center"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            {processingIds.has(mentor.id) ? "Processing..." : "Approve"}
          </Button>
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 text-xs px-3 py-1.5 whitespace-nowrap justify-center flex items-center"
            onClick={() => handleReject(mentor)}
            disabled={processingIds.has(mentor.id)}
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 md:w-7 md:h-7 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Pending Mentor Approvals
            </h1>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Review and approve or reject mentor registration requests
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 md:p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <UserCheck className="w-8 h-8 md:w-10 md:h-10 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Pending Requests
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {pagination.total || 0}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Awaiting your review
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          data={mentors}
          columns={columns}
          loading={loading}
          error={error}
          title="Pending Mentors"
          description="Review and process mentor registration requests"
          emptyStateText="No Pending Mentor Approvals"
          emptyStateDescription="All mentor registrations have been reviewed."
          actions={false}
          keyField="id"
        />
      </div>

      {!loading && !error && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            itemsPerPage={pagination.limit}
            totalItems={pagination.total}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            className="mt-4"
          />
        </div>
      )}

      <ConfirmDialog />
    </div>
  );
};

export default PendingMentorApprovals;
