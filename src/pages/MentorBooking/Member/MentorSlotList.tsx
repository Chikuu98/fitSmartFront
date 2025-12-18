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
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { getMentorSlots } from "../../../api/endpoints/mentorSlots";
import { getMentorList } from "../../../api/endpoints/mentors";
import type { MentorSlot } from "../../../interfaces/mentorSlot";
import type { Mentor } from "../../../interfaces/mentor";
import type { RootState } from "../../../store/store";
import { toast } from "react-toastify";

const MentorSlotList: React.FC = () => {
  const { mentor_id } = useParams<{ mentor_id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [slots, setSlots] = useState<MentorSlot[]>([]);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mentor_id) {
      fetchMentorData();
      fetchSlots();
    }
  }, [mentor_id, user, navigate]);

  const fetchMentorData = async () => {
    try {
      const mentors = await getMentorList();
      const mentorData = mentors.find((m) => m.id === Number(mentor_id));
      if (mentorData) {
        setMentor(mentorData);
      } else {
        setError("Mentor not found");
      }
    } catch (err) {
      console.error("Error fetching mentor data:", err);
      setError("Failed to load mentor information");
    }
  };

  const fetchSlots = async () => {
    if (!mentor_id) return;

    try {
      setLoading(true);
      const data = await getMentorSlots(Number(mentor_id));
      const availableSlots = data.filter((slot) => !slot.is_booked);
      setSlots(availableSlots);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setError("Failed to load available time slots");
      toast.error("Failed to load available time slots");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBookSlot = (slotId: number) => {
    navigate(`/member/create-booking/${mentor_id}/${slotId}`);
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
              Loading available time slots...
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
              Error Loading Slots
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

  return (
    <div className="min-h-screen transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={handleGoBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Available Time Slots
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a time slot to book your session
            </p>
          </div>
        </div>

        {/* Mentor Information Card */}
        {mentor && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {mentor.name}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {mentor.mentorDetail?.expertise || "Fitness Expert"}
                    </p>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-lg ml-1">4.8</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mentor.country}
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {mentor.language}
                  </div>
                </div>

                {mentor.mentorDetail?.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mt-3">
                    {mentor.mentorDetail.bio}
                  </p>
                )}
                {mentor.mentorDetail?.certification?.map((cert) => (
                  <div key={cert.id} className="mt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Certification: {cert.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Issued by {cert.issuer} on{" "}
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {mentor.mentorDetail?.socialLink &&
                  mentor.mentorDetail.socialLink.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Social Links
                      </h4>
                      <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400">
                        {mentor.mentorDetail.socialLink.map((link) => (
                          <li key={link.id}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {link.platform}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Available Slots */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Available Time Slots
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({slots.length} slot{slots.length !== 1 ? "s" : ""} available)
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Available Slots
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This mentor doesn't have any available time slots at the moment.
              </p>
              <Button variant="outline" onClick={handleGoBack}>
                Choose Another Mentor
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-orange-300 dark:hover:border-orange-600 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(slot.date)}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {formatTime(slot.start_time)} -{" "}
                      {formatTime(slot.end_time)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                      Available
                    </span>
                  </div>

                  <Button
                    variant="orange"
                    onClick={() => handleBookSlot(slot.id)}
                    className="w-full"
                  >
                    Book This Slot
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorSlotList;
