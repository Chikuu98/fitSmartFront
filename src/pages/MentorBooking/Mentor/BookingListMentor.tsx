import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Clock,
  XCircle,
  Video,
  Calendar,
  CreditCard,
  AlertCircle,
  Edit,
  CheckCircle2,
  Star,
  User,
} from "lucide-react";
import type { Booking } from "../../../interfaces/booking";
import type { Rating } from "../../../interfaces/rating";
import { getBookingsByMentorId } from "../../../api/endpoints/bookings";
import { getRatingByBooking } from "../../../api/endpoints/ratings";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import Pagination from "../../../components/ui/pagination";
import { usePagination } from "../../../hooks/usePagination";
import type { RootState } from "../../../store/store";
import { useCreateGoogleMeeting } from "../../../hooks/useCreateGoogleMeeting";
import { acceptBooking, cancelBooking, completeBooking } from "../../../api/endpoints/bookings";
import { toast } from "react-toastify";
import { Button, RatingCard, CustomSelect } from "../../../components/ui";

const BookingListMentor: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [bookingRatings, setBookingRatings] = useState<Record<number, Rating>>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const mentor_id = useSelector((state: RootState) => state.auth.user?.id);
  const { openDialog, ConfirmDialog } = useConfirmationDialog();
  const navigate = useNavigate();

  const {
    currentPage,
    itemsPerPage,
    pagination,
    setPagination,
    handlePageChange,
    handleItemsPerPageChange,
    handlePrevPage,
    handleNextPage,
  } = usePagination({
    initialPage: 1,
    initialItemsPerPage: 10,
  });

  useEffect(() => {
    if (!mentor_id) return;
    const fetchBookings = async () => {
      try {
        const response = await getBookingsByMentorId(mentor_id, currentPage, itemsPerPage);
        setBookings(response.data);
        setPagination(response.pagination);
        
        const completedBookings = response.data.filter((b: Booking) => b.status === "completed");
        const ratingsMap: Record<number, Rating> = {};
        
        await Promise.all(
          completedBookings.map(async (booking: Booking) => {
            try {
              const rating = await getRatingByBooking(booking.id);
              if (rating) {
                ratingsMap[booking.id] = rating;
              }
            } catch (err) {
            }
          })
        );
        
        setBookingRatings(ratingsMap);
      } catch (error) {
        console.error("Failed to load bookings", error);
      }
    };
    fetchBookings();
  }, [mentor_id, currentPage, itemsPerPage]);

  const handleMeetingSuccess = () => {
    refetchBookings();
  };

  const handleMeetingError = (err: any) => {
    console.error(err);
  };

  const refetchBookings = async () => {
    if (!mentor_id) return;
    try {
      const response = await getBookingsByMentorId(mentor_id, currentPage, itemsPerPage);
      setBookings(response.data);
      setPagination(response.pagination);
      
      const completedBookings = response.data.filter((b: Booking) => b.status === "completed");
      const ratingsMap: Record<number, Rating> = {};
      
      await Promise.all(
        completedBookings.map(async (booking: Booking) => {
          try {
            const rating = await getRatingByBooking(booking.id);
            if (rating) {
              ratingsMap[booking.id] = rating;
            }
          } catch (err) {
          }
        })
      );
      
      setBookingRatings(ratingsMap);
    } catch (error) {
      toast.error("Failed to reload bookings");
    }
  };

  const handleAccept = async (booking: Booking) => {
    if (!booking.google_meet_link) {
      toast.info("You must create a meeting before accepting.");
      return;
    }

    openDialog({
      title: "Accept Booking",
      message: `Are you sure you want to accept the booking with ${booking.member?.name}?`,
      confirmText: "Accept",
      cancelText: "Cancel",
      variant: "info",
      loading: loadingId === booking.id,
      onConfirm: async (close) => {
        close();
        setLoadingId(booking.id);
        try {
          await acceptBooking(booking.id, booking.google_meet_link!);
          refetchBookings();
        } catch (err) {
        } finally {
          setLoadingId(null);
        }
      },
    });
  };

  const handleCancel = async (booking: Booking) => {
    openDialog({
      title: "Cancel Booking",
      message: `Are you sure you want to cancel the booking with ${booking.member?.name}? This action cannot be undone.`,
      confirmText: "Cancel Booking",
      cancelText: "Keep Booking",
      variant: "danger",
      loading: loadingId === booking.id,
      onConfirm: async (close) => {
        close();
        setLoadingId(booking.id);
        try {
          await cancelBooking(booking.id);
          refetchBookings();
        } catch (err) {
        } finally {
          setLoadingId(null);
        }
      },
    });
  };

  const handleComplete = async (booking: Booking) => {
    openDialog({
      title: "Complete Session",
      message: `Are you sure you want to mark the session with ${booking.member?.name} as completed?`,
      confirmText: "Mark Complete",
      variant: "info",
      onConfirm: async (close) => {
        close();
        setLoadingId(booking.id);
        try {
          await completeBooking(booking.id);
          refetchBookings();
        } catch (error: any) {
          console.error(error);
        } finally {
          setLoadingId(null);
        }
      },
    });
  };

  const createMeeting = useCreateGoogleMeeting(
    selectedBooking,
    handleMeetingSuccess,
    handleMeetingError,
  );

  const isSessionEnded = (booking: Booking): boolean => {
    if (!booking.mentorSlot) return false;
    
    const sessionDate = new Date(booking.mentorSlot.date);
    const [hours, minutes] = booking.mentorSlot.end_time.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);
    
    const now = new Date();
    return now >= sessionDate;
  };

  const filteredBookings = statusFilter === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  const statusOptions = [
    { value: "all", label: "All Bookings" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900";
      case "rejected":
      case "cancelled":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900";
      case "completed":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900";
      default:
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 dark:text-green-400";
      case "refunded":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-orange-600 dark:text-orange-400";
    }
  };

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              My Bookings
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your mentoring sessions and client bookings
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {bookings.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Total Bookings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {bookings.filter((b) => b.status === "accepted").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Confirmed
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {bookings.filter((b) => b.status === "pending").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Pending
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {bookings.filter((b) => b.status === "completed").length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Status
          </label>
          <CustomSelect
            name="statusFilter"
            options={statusOptions}
            value={statusFilter}
            onChange={(option: any) => setStatusFilter(option?.value || "all")}
            placeholder="Select status..."
            isClearable={false}
          />
        </div>

        {/* Bookings List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {statusFilter === "all" ? "All Bookings" : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Bookings`} ({filteredBookings.length})
            </h2>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {statusFilter === "all" ? "No Bookings Yet" : `No ${statusFilter} bookings found`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {statusFilter === "all" 
                  ? "You don't have any bookings yet."
                  : `There are no ${statusFilter} bookings at the moment.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex flex-col gap-4">
                    {/* Header Section - Member Info & Status */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600 dark:text-orange-400" />
                      </div>

                      {/* Member Info & Status */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {booking.member?.name || "Unknown Member"}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                              {booking.member?.email}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusIcon(booking.status)}
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(booking.status)}`}
                            >
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-[4.5rem] text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {booking.mentorSlot?.date
                            ? formatDate(booking.mentorSlot.date)
                            : "Date TBD"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {booking.mentorSlot?.start_time &&
                          booking.mentorSlot?.end_time
                            ? `${formatTime(booking.mentorSlot.start_time)} - ${formatTime(booking.mentorSlot.end_time)}`
                            : "Time TBD"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <CreditCard className="w-4 h-4 flex-shrink-0" />
                        <span
                          className={`truncate ${getPaymentStatusColor(
                            booking.bookingPayment?.status || "unpaid",
                          )}`}
                        >
                          Payment:{" "}
                          {booking.bookingPayment?.status
                            ? booking.bookingPayment.status
                                .charAt(0)
                                .toUpperCase() +
                              booking.bookingPayment.status.slice(1)
                            : "Unpaid"}
                        </span>
                      </div>
                    </div>

                    {/* Actions Section */}
                    {(booking.google_meet_link || 
                      booking.status === "pending" || 
                      (booking.status === "accepted" && booking.bookingPayment?.status === "paid") ||
                      (booking.status !== "cancelled" && booking.status !== "completed")) && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pl-0 sm:pl-[4.5rem] pt-2 border-t border-gray-100 dark:border-gray-700">
                        {/* Join Meeting Button */}
                        {booking.google_meet_link && 
                         booking.status !== "cancelled" && 
                         booking.status !== "completed" && (
                          <Button
                            variant="blue"
                            onClick={() => window.open(booking.google_meet_link!, "_blank", "noopener,noreferrer")}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto"
                          >
                            <Video className="w-4 h-4" />
                            Meeting Link
                          </Button>
                        )}

                        {/* Edit Button */}
                        {booking.status !== "cancelled" && booking.status !== "completed" && (
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/mentor/bookings/update/${booking.id}`)}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                        )}

                        {/* Pending Actions */}
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="blue"
                              onClick={() => {
                                setSelectedBooking(booking);
                                createMeeting();
                              }}
                              disabled={loadingId === booking.id}
                              className="flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                              {booking.google_meet_link ? "Meeting Created" : "Create Meeting"}
                            </Button>
                            <Button
                              variant="green"
                              onClick={() => handleAccept(booking)}
                              disabled={loadingId === booking.id}
                              className="flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                              <BadgeCheck className="w-4 h-4" />
                              Accept
                            </Button>
                            <Button
                              variant="red"
                              onClick={() => handleCancel(booking)}
                              disabled={loadingId === booking.id}
                              className="flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </Button>
                          </>
                        )}

                        {/* Mark Complete Button */}
                        {booking.status === "accepted" && booking.bookingPayment?.status === "paid" && isSessionEnded(booking) && (
                          <Button
                            variant="green"
                            onClick={() => handleComplete(booking)}
                            disabled={loadingId === booking.id}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Rating Display Section */}
                    {booking.status === "completed" && (
                      <div className="pl-0 sm:pl-[4.5rem] pt-3 border-t border-gray-100 dark:border-gray-700">
                        {bookingRatings[booking.id] ? (
                          <>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                              <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                              Member's Review
                            </h4>
                            <RatingCard
                              rating={bookingRatings[booking.id]}
                              showMentorName={false}
                            />
                          </>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No rating received yet
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredBookings.length > 0 && (
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

        <ConfirmDialog />
      </div>
    </div>
  );
};

export default BookingListMentor;
