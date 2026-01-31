import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
} from "lucide-react";
import type { MentorSlot } from "../../../interfaces/mentorSlot";
import {
  getMentorSlots,
  deleteMentorSlot,
} from "../../../api/endpoints/mentorSlots";
import { Button } from "../../../components/ui/button";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import { Pagination } from "../../../components/ui/pagination";
import { usePagination } from "../../../hooks/usePagination";
import type { RootState } from "../../../store/store";
import { toast } from "react-toastify";

export function MyMentorSlotList() {
  const [slots, setSlots] = useState<MentorSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const mentor_id = useSelector((state: RootState) => state.auth.user?.id);
  const navigate = useNavigate();
  const { openDialog, ConfirmDialog } = useConfirmationDialog();
  const {
    currentPage,
    itemsPerPage,
    pagination,
    setCurrentPage,
    setItemsPerPage,
    setPagination,
    handlePrevPage,
    handleNextPage,
  } = usePagination();

  useEffect(() => {
    if (!mentor_id) return;
    fetchSlots();
  }, [mentor_id, currentPage, itemsPerPage]);

  const fetchSlots = async () => {
    if (!mentor_id) return;
    try {
      setLoading(true);
      const response = await getMentorSlots(mentor_id, currentPage, itemsPerPage);
      setSlots(response.data);
      if (response.pagination) {
        setPagination({
          total: response.pagination.total,
          page: response.pagination.page,
          limit: response.pagination.limit,
          totalPages: response.pagination.totalPages,
          hasNext: response.pagination.hasNext,
          hasPrev: response.pagination.hasPrev,
        });
      }
    } catch (error: any) {
      toast.error("Failed to load time slots");
      console.error("Failed to load slots", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slotId: number) => {
    openDialog({
      title: "Delete Time Slot",
      message:
        "Are you sure you want to delete this time slot? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      loading: deleteLoading === slotId,
      onConfirm: async (close) => {
        close();
        setDeleteLoading(slotId);
        try {
          await deleteMentorSlot(slotId);
          fetchSlots();
        } catch (error: any) {
        } finally {
          setDeleteLoading(null);
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading time slots...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              My Time Slots
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your availability for mentoring sessions
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Button variant="outline" onClick={fetchSlots} className="px-3">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="orange"
              onClick={() => navigate("/mentor/create-slot")}
              className="flex-1 sm:flex-none whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Time Slot
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {slots.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Total Slots
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {slots.filter((s) => !s.is_booked).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Available
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {slots.filter((s) => s.is_booked).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Booked
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              All Time Slots ({slots.length})
            </h2>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Time Slots Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first time slot to start accepting bookings.
              </p>
              <Button
                variant="orange"
                onClick={() => navigate("/mentor/create-slot")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex flex-col gap-3">
                    {/* Header Section - Date & Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {formatDate(slot.date)}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {formatTime(slot.start_time)} -{" "}
                            {formatTime(slot.end_time)}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {slot.is_booked ? (
                          <>
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900">
                              Booked
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900">
                              Available
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions Section */}
                    <div className="flex gap-2 sm:gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <Button
                        variant="blue"
                        onClick={() =>
                          navigate(`/mentor/time-slots/edit/${slot.id}`)
                        }
                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>

                      <Button
                        variant="outline"
                        disabled={deleteLoading === slot.id}
                        onClick={() => handleDelete(slot.id)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        {deleteLoading === slot.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={itemsPerPage}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          </div>
        )}

        <ConfirmDialog />
      </div>
    </div>
  );
}
