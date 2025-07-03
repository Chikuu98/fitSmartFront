import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Video,
  MapPin,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useConfirmationDialog } from '../../../components/ui/confirmationDialog';
import { getBookingsByMemberId, cancelBooking } from '../../../api/endpoints/bookings';
import type { Booking } from '../../../interfaces/booking';
import type { RootState } from '../../../store/store';
import { toast } from 'react-toastify';

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { openDialog, ConfirmDialog } = useConfirmationDialog();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user, navigate]);

  const fetchBookings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getBookingsByMemberId(user.id);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings');
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    openDialog({
      title: 'Cancel Booking',
      message: `Are you sure you want to cancel your booking with ${booking.mentorSlot?.mentor?.name || 'this mentor'}? This action cannot be undone.`,
      confirmText: 'Cancel Booking',
      cancelText: 'Keep Booking',
      variant: 'danger',
      loading: cancellingId === booking.id,
      onConfirm: async (close) => {
        close();
        setCancellingId(booking.id);
        
        try {
          await cancelBooking(booking.id);
          toast.success('Booking cancelled successfully');
          fetchBookings();
        } catch (err) {
          console.error('Error cancelling booking:', err);
          toast.error('Failed to cancel booking');
        } finally {
          setCancellingId(null);
        }
      },
    });
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900';
      case 'rejected':
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900';
      case 'completed':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 dark:text-green-400';
      case 'refunded':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-orange-600 dark:text-orange-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading your bookings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error Loading Bookings
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchBookings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your mentoring sessions and track your progress
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={fetchBookings}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              variant="orange" 
              onClick={() => navigate('/member/search-for-mentor')}
            >
              Book New Session
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookings.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookings.filter(b => b.status === 'accepted').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Bookings ({bookings.length})
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Bookings Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't booked any mentoring sessions yet. Start by finding a mentor!
              </p>
              <Button 
                variant="orange" 
                onClick={() => navigate('/member/search-for-mentor')}
              >
                Find a Mentor
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left side - Booking info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {booking.mentorSlot?.mentor?.name || 'Unknown Mentor'}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {booking.mentorSlot?.mentor?.mentorDetail?.expertise || 'Fitness Expert'}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {getStatusIcon(booking.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.mentorSlot?.date ? formatDate(booking.mentorSlot.date) : 'Date TBD'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>
                                {booking.mentorSlot?.start_time && booking.mentorSlot?.end_time
                                  ? `${formatTime(booking.mentorSlot.start_time)} - ${formatTime(booking.mentorSlot.end_time)}`
                                  : 'Time TBD'}
                              </span>
                            </div>
                            
                            {booking.mentorSlot?.mentor?.country && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.mentorSlot.mentor.country}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              <span className={getPaymentStatusColor(booking.payment_status)}>
                                Payment: {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col lg:w-48">
                      {booking.google_meet_link && booking.status === 'accepted' && (
                        <Button
                          variant="blue"
                          onClick={() => handleJoinMeeting(booking.google_meet_link!)}
                          className="flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Join Meeting
                        </Button>
                      )}
                      
                      {booking.status === 'pending' && (
                        <Button
                          variant="outline"
                          onClick={() => handleCancelBooking(booking)}
                          disabled={cancellingId === booking.id}
                          className="flex items-center justify-center gap-2"
                        >
                          {cancellingId === booking.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default MyBookings;
