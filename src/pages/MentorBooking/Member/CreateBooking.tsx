import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  ArrowLeft,
  User,
  MapPin,
  Globe,
  Star,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useConfirmationDialog } from "../../../components/ui/confirmationDialog";
import { getSlotById } from "../../../api/endpoints/mentorSlots";
import { getMentorList } from "../../../api/endpoints/mentors";
import { createBooking } from "../../../api/endpoints/bookings";
import type { MentorSlot } from "../../../interfaces/mentorSlot";
import type { Mentor } from "../../../interfaces/mentor";
import type { RootState } from "../../../store/store";

const CreateBooking: React.FC = () => {
  const { mentor_id, slotId } = useParams<{
    mentor_id: string;
    slotId: string;
  }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { openDialog, ConfirmDialog } = useConfirmationDialog();

  const [slot, setSlot] = useState<MentorSlot | null>(null);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mentor_id && slotId) {
      fetchData();
    }
  }, [mentor_id, slotId, user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const mentors = await getMentorList();
      const mentorData = mentors.find((m) => m.id === Number(mentor_id));

      if (!mentorData) {
        setError("Mentor not found");
        return;
      }

      setMentor(mentorData);

      const slotData = await getSlotById(Number(slotId));

      if (!slotData) {
        setError("Time slot not found");
        return;
      }

      if (slotData.is_booked) {
        setError("This time slot is no longer available");
        return;
      }

      setSlot(slotData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load booking information");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/member/mentor-slots/${mentor_id}`);
  };

  const handleCreateBooking = () => {
    if (!slot || !mentor) return;

    openDialog({
      title: "Confirm Booking",
      message: `Are you sure you want to book this session with ${mentor.name}?`,
      confirmText: "Book Session",
      cancelText: "Cancel",
      variant: "info",
      loading: bookingLoading,
      onConfirm: async (close) => {
        close();
        setBookingLoading(true);

        try {
          await createBooking({
            mentor_slot_id: slot.id,
          });

          navigate("/member/my-bookings");
        } catch (err: any) {
          console.error("Error creating booking:", err);
        } finally {
          setBookingLoading(false);
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
              Loading booking information...
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
              Booking Error
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button variant="outline" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!slot || !mentor) {
    return (
      <div className="min-h-screen transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Information Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unable to load booking information.
            </p>
            <Button variant="outline" onClick={handleGoBack}>
              Go Back
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
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={handleGoBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Book Your Session
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and confirm your booking details
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mentor Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Your Mentor
            </h2>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {mentor.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {mentor.mentorDetail?.expertise || "Fitness Expert"}
                    </p>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm ml-1">4.8</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mentor.country}
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {mentor.language}
                  </div>
                </div>
              </div>
            </div>

            {mentor.mentorDetail?.bio && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  About
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mentor.mentorDetail.bio}
                </p>
              </div>
            )}

            {mentor.mentorDetail?.certification && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Certifications
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mentor.mentorDetail.certification?.map((cert) => (
                    <span key={cert.id} className="block">
                      {cert.title} by {cert.issuer} (
                      {new Date(cert.issue_date).toLocaleDateString()})
                    </span>
                  )) || "No certifications available"}
                </p>
              </div>
            )}

            {mentor.mentorDetail?.socialLink && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Social Links
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mentor.mentorDetail.socialLink.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:underline"
                    >
                      {link.platform}: {link.url}
                    </a>
                  ))}
                </p>
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            {/* Time Slot Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Session Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Date
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDate(slot.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Time
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatTime(slot.start_time)} -{" "}
                      {formatTime(slot.end_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Status
                    </p>
                    <p className="text-green-600 dark:text-green-400">
                      Available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Booking Information
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Member:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Email:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Session Type:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    1-on-1 Mentoring
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Payment Status:
                  </span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">
                    Pending
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Booking Process
                    </p>
                    <p className="text-blue-700 dark:text-blue-300">
                      After you confirm this booking, your mentor will review
                      and accept it. You'll receive a notification once
                      confirmed, and meeting details will be shared.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="flex-1"
                disabled={bookingLoading}
              >
                Back to Slots
              </Button>
              <Button
                variant="orange"
                onClick={handleCreateBooking}
                className="flex-1"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Creating Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>

        <ConfirmDialog />
      </div>
    </div>
  );
};

export default CreateBooking;
